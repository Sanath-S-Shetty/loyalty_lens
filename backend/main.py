import uuid
import json
import os
import redis
from typing import Optional
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from contextlib import asynccontextmanager

# Database and Schema imports
from database import engine, SessionLocal, Base, DBJob, init_db, DBContactMessage
from schema import AnalysisRequest, JobResponse, ContactMessageRequest

# Import the LangGraph pipeline
from agents import loyalty_agent_pipeline

# Build tables locally in Postgres automatically on startup
init_db()

# Initialize Redis
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
try:
    if REDIS_URL.startswith("rediss://") or REDIS_URL.startswith("redis://"):
        redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    else:
        # Fallback to local host configuration if not a connection URI
        redis_client = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            db=0,
            decode_responses=True
        )
    redis_client.ping()
    print("🟢 Redis connected successfully!")
except Exception as e:
    print(f"🔴 Redis connection failed: {e}")
    redis_client = None

# Background Cleanup Task
def clean_old_database_records():
    """Deletes any job or report older than 30 days from Postgres."""
    print("🧹 Running scheduled database cleanup...")
    db = SessionLocal()
    try:
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        deleted_jobs = db.query(DBJob).filter(DBJob.created_at < cutoff_date).delete()
        db.commit()
        print(f"✅ Cleanup complete: Deleted {deleted_jobs} old reports.")
    except Exception as e:
        print(f"❌ Database cleanup failed: {e}")
        db.rollback()
    finally:
        db.close()

# Lifespan must be defined BEFORE the app is initialized
@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()
    scheduler.add_job(clean_old_database_records, 'interval', days=1)
    scheduler.start()
    print("⏱️ Background scheduler started (Running daily cleanups)")
    yield 
    scheduler.shutdown()

# Initialize the FastAPI App EXACTLY ONCE
app = FastAPI(title="Loyalty Lens API Engine", lifespan=lifespan)

# Handle CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def sanitize_result_data(data):
    """Ensures that the data payload always has the arrays React expects to prevent frontend crashes."""
    if not isinstance(data, dict):
        return data
        
    if "sentiment" not in data or not isinstance(data["sentiment"], dict):
        data["sentiment"] = {}
        
    if "positiveThemes" not in data or not isinstance(data["positiveThemes"], list):
        data["positiveThemes"] = []
        
    if "negativeThemes" not in data or not isinstance(data["negativeThemes"], list):
        data["negativeThemes"] = []
        
    return data

# Async worker processing pipeline using LangGraph
def run_agent_pipeline(job_id: str, company_name: str):
    db = SessionLocal()
    job = db.query(DBJob).filter(DBJob.job_id == job_id).first()
    
    if job:
        job.status = "PROCESSING"
        db.commit()
        
        try:
            initial_state = {"company_name": company_name}
            final_state = loyalty_agent_pipeline.invoke(initial_state)
            final_report = final_state.get("final_report")
            
            if final_report:
                job.status = "COMPLETED"
                report_dict = final_report.model_dump() if hasattr(final_report, "model_dump") else final_report
                
                # 🔥 DATA SANITIZATION: Protect the frontend from crashing 🔥
                if "sentiment" not in report_dict or not isinstance(report_dict["sentiment"], dict):
                    report_dict["sentiment"] = {}
                
                if "positiveThemes" not in report_dict or not isinstance(report_dict["positiveThemes"], list):
                    report_dict["positiveThemes"] = []
                if "negativeThemes" not in report_dict or not isinstance(report_dict["negativeThemes"], list):
                    report_dict["negativeThemes"] = []
                    
                job.result_data = report_dict
                
                # 🔥 REDIS SAVE 🔥
                if redis_client:
                    clean_name = company_name.replace(" ", "").lower()
                    redis_payload = {
                        "job_id": job.job_id,
                        "result_data": job.result_data
                    }
                    redis_client.setex(
                        f"loyalty_lens:{clean_name}",
                        86400 * 7, # 7 Days
                        json.dumps(redis_payload)
                    )
            else:
                job.status = "FAILED"
                job.result_data = {"error": "Pipeline failed to generate report"}
                
        except Exception as e:
            job.status = "FAILED"
            job.result_data = {"error": str(e)}
            
        db.commit()
    db.close()

def find_existing_job(db: Session, company_name: str) -> Optional[DBJob]:
    clean_req = company_name.strip().lower()
    
    # 1. Exact match (ignoring whitespace and casing)
    clean_req_no_spaces = clean_req.replace(" ", "")
    existing = db.query(DBJob).filter(
        func.replace(func.lower(DBJob.company_name), ' ', '') == clean_req_no_spaces
    ).first()
    if existing:
        return existing

    # 2. Fuzzy match based on word-overlap
    # e.g., "KFC Rewards Program" will match "kfc", "Starbucks India" will match "Starbucks", and vice-versa
    all_jobs = db.query(DBJob).all()
    req_words = set(clean_req.split())
    
    for job in all_jobs:
        job_name = job.company_name.strip().lower()
        job_words = set(job_name.split())
        
        # Ensure we only compare non-empty names
        if not job_words or not req_words:
            continue
            
        # Check if the words of one are a subset of the other (so "kfc" matches "kfc rewards program" and vice-versa)
        if req_words.issubset(job_words) or job_words.issubset(req_words):
            # Exclude match if they only overlap on trivial words
            trivial_words = {"rewards", "program", "loyalty", "club", "card", "rewards-program", "rewards_program"}
            non_trivial_req_words = req_words - trivial_words
            non_trivial_job_words = job_words - trivial_words
            
            common_non_trivial = non_trivial_req_words.intersection(non_trivial_job_words)
            if common_non_trivial:
                return job
                
    return None

@app.post("/api/analyze", response_model=JobResponse)
def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # 1. Resolve any existing job using the robust deduplication match helper
    existing_job = find_existing_job(db, request.company_name)
    
    if existing_job:
        canonical_name = existing_job.company_name
        clean_name = canonical_name.replace(" ", "").lower()
        cache_key = f"loyalty_lens:{clean_name}"
        
        # 🔥 LAYER 1: REDIS CHECK using canonical cache key 🔥
        if redis_client:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                print(f"⚡ REDIS HIT for canonical {clean_name}")
                parsed_cache = json.loads(cached_data)
                return {
                    "job_id": existing_job.job_id, 
                    "status": "COMPLETED", 
                    "company_name": canonical_name,
                    "result_data": sanitize_result_data(parsed_cache.get("result_data", parsed_cache))
                }
                
        # LAYER 2: POSTGRES HIT using the matched existing job
        print(f"🗄️ POSTGRES HIT for canonical {clean_name}")
        
        # Backfill Redis if it was missing
        if existing_job.status == "COMPLETED" and existing_job.result_data and redis_client:
            redis_payload = {
                "job_id": existing_job.job_id,
                "result_data": existing_job.result_data
            }
            redis_client.setex(cache_key, 86400 * 7, json.dumps(redis_payload))
            
        return {
            "job_id": existing_job.job_id, 
            "status": existing_job.status, 
            "company_name": canonical_name
        }
    
    # 2. CACHE MISS: Trigger AI
    clean_req_name = request.company_name.replace(" ", "").lower()
    print(f"🔍 CACHE MISS: Starting AI for {clean_req_name}")
    formatted_name = request.company_name.strip()
    job_id = str(uuid.uuid4())
    
    new_job = DBJob(job_id=job_id, company_name=formatted_name, status="PENDING")
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    background_tasks.add_task(run_agent_pipeline, job_id, formatted_name)
    
    return {"job_id": job_id, "status": "PENDING", "company_name": formatted_name}

@app.get("/api/results/{job_id}", response_model=JobResponse)
def get_results(job_id: str, db: Session = Depends(get_db)):
    job = db.query(DBJob).filter(DBJob.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Analysis instance not found")
    sanitized_data = sanitize_result_data(job.result_data) if job.result_data else None
    return {"job_id": job.job_id, "status": job.status, "company_name": job.company_name, "result_data": sanitized_data}

@app.get("/api/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    # Order by created_at desc so that we keep the most recent entries
    completed_jobs = db.query(DBJob).filter(DBJob.status == "COMPLETED").order_by(DBJob.created_at.desc()).all()
    
    seen_canonical_names = set()
    deduplicated_jobs = []
    
    for job in completed_jobs:
        clean_name = job.company_name.strip().lower()
        
        is_duplicate = False
        req_words = set(clean_name.split())
        trivial_words = {"rewards", "program", "loyalty", "club", "card", "rewards-program", "rewards_program"}
        non_trivial_req_words = req_words - trivial_words
        
        for seen in seen_canonical_names:
            seen_words = set(seen.split())
            if req_words.issubset(seen_words) or seen_words.issubset(req_words):
                non_trivial_seen_words = seen_words - trivial_words
                common = non_trivial_req_words.intersection(non_trivial_seen_words)
                if common:
                    is_duplicate = True
                    break
                    
        if not is_duplicate:
            seen_canonical_names.add(clean_name)
            deduplicated_jobs.append(job)
            
    brands = []
    total_score = 0
    total_sentiment = 0

    for job in deduplicated_jobs:
        data = job.result_data or {}
        score = float(data.get("score", 0))
        sentiment_data = data.get("sentiment", {})

        if isinstance(sentiment_data, dict):
            sentiment_val = sentiment_data.get("positive", 0)
        else:
            sentiment_val = 0

        if isinstance(sentiment_val, str):
            sentiment_val = float(sentiment_val.replace("%", "").strip())
        else:
            sentiment_val = float(sentiment_val)
            
        total_score += score
        total_sentiment += sentiment_val
        
        brands.append({
            "key": job.company_name,
            "name": job.company_name,
            "score": score,
            "sentiment": sentiment_val,
            "marketPosition": data.get("marketPosition", "Challenger")
        })

    total_brands = len(brands)
    
    return {
        "metrics": {
            "totalBrands": total_brands,
            "avgScore": round(total_score / total_brands) if total_brands > 0 else 0,
            "avgSentiment": round(total_sentiment / total_brands) if total_brands > 0 else 0,
            "totalScrapes": total_brands * 2
        },
        "brands": brands
    }

@app.post("/api/comparison")
def get_comparison_matrix(company_names: list[str] = Body(...), db: Session = Depends(get_db)):
    if not company_names:
        return []
        
    # Resolve requested names to existing jobs in the database using the same helper
    matched_jobs = []
    seen_job_ids = set()
    
    for name in company_names:
        matched = find_existing_job(db, name)
        if matched and matched.status == "COMPLETED" and matched.job_id not in seen_job_ids:
            seen_job_ids.add(matched.job_id)
            matched_jobs.append(matched)
            
    matrix_data = []
    for job in matched_jobs:
        data = job.result_data or {}
        
        sentiment_data = data.get("sentiment", {})
        sentiment_val = sentiment_data.get("positive", 0) if isinstance(sentiment_data, dict) else 0
        if isinstance(sentiment_val, str):
            sentiment_val = float(sentiment_val.replace("%", "").strip())
        else:
            sentiment_val = float(sentiment_val)
            
        sources_list = []
        for src in data.get("actual_sources", data.get("sources", [])):
            sources_list.append({
                "title": src.get("name", "Official Reference"),
                "url": src.get("url", "#"),
            })
            
        matrix_data.append({
            "key": job.company_name.lower(),
            "name": job.company_name,
            "score": float(data.get("score", 0)),
            "sentiment": round(sentiment_val),
            "marketPosition": data.get("marketPosition", "Challenger"),
            "confidence": data.get("confidence"),
            "earnRate": data.get("earning_method", data.get("earnRate", "Standard collection structure.")),
            "strengths": data.get("key_strengths", data.get("strengths", "Solid customer baseline adoption.")),
            "sources": sources_list if sources_list else [
                {"title": "Official Portal", "url": "#", "credibility": 95},
                {"title": "Public Registry", "url": "#", "credibility": 85}
            ]
        })
        
    return matrix_data

@app.get("/api/cleanup-duplicate")
def cleanup_duplicate(db: Session = Depends(get_db)):
    deleted_count = db.query(DBJob).filter(DBJob.company_name == "Starbucks").delete()
    db.commit()
    return {"status": "success", "deleted_rows": deleted_count}

@app.get("/api/companies/search")
def search_companies(q: str = "", db: Session = Depends(get_db)):
    if not q.strip():
        return []
        
    results = db.query(DBJob.company_name).filter(
        DBJob.status == "COMPLETED",
        DBJob.company_name.ilike(f"%{q.strip()}%")
    ).distinct().limit(5).all()
    
    return [r[0] for r in results]


@app.get("/api/nuke-database")
def nuke_database(db: Session = Depends(get_db)):
    try:
        # 1. Delete all rows from the Postgres DBJob table
        deleted_count = db.query(DBJob).delete()
        db.commit()
        
        # 2. Flush all keys from Redis memory
        if redis_client:
            redis_client.flushdb()
            
        return {"status": "success", "message": f"💥 Deleted {deleted_count} rows from Postgres and cleared Redis!"}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}

@app.post("/api/contact")
def submit_contact_message(request: ContactMessageRequest, db: Session = Depends(get_db)):
    try:
        db_msg = DBContactMessage(
            name=request.name.strip(),
            email=request.email.strip(),
            subject=request.subject.strip() if request.subject else None,
            message=request.message.strip()
        )
        db.add(db_msg)
        db.commit()
        db.refresh(db_msg)
        return {"status": "success", "message_id": db_msg.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/contact")
def get_contact_messages(db: Session = Depends(get_db)):
    try:
        messages = db.query(DBContactMessage).order_by(DBContactMessage.created_at.desc()).all()
        return [
            {
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "subject": m.subject,
                "message": m.message,
                "created_at": m.created_at.isoformat() if m.created_at else None
            }
            for m in messages
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))