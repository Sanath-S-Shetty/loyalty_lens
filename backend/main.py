import uuid
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from sqlalchemy import func

# Cleaned up imports to point consistently to your database and schemas
from database import engine, SessionLocal, Base, DBJob, init_db
from schema import AnalysisRequest, JobResponse

# Import the LangGraph pipeline
from agents import loyalty_agent_pipeline

# Build tables locally in Postgres automatically on startup
init_db()

app = FastAPI(title="Loyalty Lens API Engine")

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

# Async worker processing pipeline using LangGraph
def run_agent_pipeline(job_id: str, company_name: str):
    db = SessionLocal()
    job = db.query(DBJob).filter(DBJob.job_id == job_id).first()
    
    if job:
        job.status = "PROCESSING"
        db.commit()
        
        try:
            # 1. Initialize the starting state for LangGraph
            initial_state = {"company_name": company_name}
            
            # 2. Run the LangGraph pipeline
            final_state = loyalty_agent_pipeline.invoke(initial_state)
            
            # 3. Extract the report from the final state
            final_report = final_state.get("final_report")
            
            if final_report:
                job.status = "COMPLETED"
                # If final_report is a Pydantic object, serialize it with .model_dump()
                # If it's already a dictionary, you can pass it directly.
                if hasattr(final_report, "model_dump"):
                    job.result_data = final_report.model_dump()
                else:
                    job.result_data = final_report
            else:
                job.status = "FAILED"
                job.result_data = {"error": "Pipeline failed to generate report"}
                
        except Exception as e:
            job.status = "FAILED"
            job.result_data = {"error": str(e)}
            
        db.commit()
    db.close()

# @app.post("/api/analyze", response_model=JobResponse)
# def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
#     job_id = str(uuid.uuid4())
    
#     new_job = DBJob(job_id=job_id, company_name=request.company_name, status="PENDING")
#     db.add(new_job)
#     db.commit()
#     db.refresh(new_job)
    
#     # Trigger the LangGraph background task
#     background_tasks.add_task(run_agent_pipeline, job_id, request.company_name)
#     return {"job_id": job_id, "status": "PENDING", "company_name": request.company_name}


# @app.post("/api/analyze", response_model=JobResponse)
# def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
#     # 1. Check if a job for this company already exists (using ilike for case-insensitive matching)
#     existing_job = db.query(DBJob).filter(
#         DBJob.company_name.ilike(request.company_name)
#     ).first()

#     # 2. If it exists, return the existing job_id immediately
#     if existing_job:
#         # If it's COMPLETED, the frontend will fetch the data instantly.
#         # If it's PENDING/PROCESSING, the frontend will just attach to the ongoing process.
#         return {
#             "job_id": existing_job.job_id, 
#             "status": existing_job.status, 
#             "company_name": existing_job.company_name
#         }
    
#     # 3. If it does NOT exist, create a new job and trigger the AI pipeline
#     job_id = str(uuid.uuid4())
    
#     new_job = DBJob(job_id=job_id, company_name=request.company_name, status="PENDING")
#     db.add(new_job)
#     db.commit()
#     db.refresh(new_job)
    
#     # Trigger the LangGraph background task
#     background_tasks.add_task(run_agent_pipeline, job_id, request.company_name)
    
#     return {"job_id": job_id, "status": "PENDING", "company_name": request.company_name}


# Ensure uuid is imported if it isn't already

@app.post("/api/analyze", response_model=JobResponse)
def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # 1. Brutally normalize the incoming name: remove all spaces and make it lowercase
    # Example: "Air India " becomes "airindia"
    clean_req_name = request.company_name.replace(" ", "").lower()

    # 2. Check the DB by forcing PostgreSQL to strip spaces and lowercase its own rows for the comparison
    existing_job = db.query(DBJob).filter(
        func.replace(func.lower(DBJob.company_name), ' ', '') == clean_req_name
    ).first()

    # 3. If it exists, return the existing job_id immediately
    if existing_job:
        # If it's COMPLETED, the frontend will fetch the data instantly.
        # If it's PENDING/PROCESSING, the frontend will just attach to the ongoing process.
        return {
            "job_id": existing_job.job_id, 
            "status": existing_job.status, 
            "company_name": existing_job.company_name
        }
    
    # 4. If it does NOT exist, neatly format the name to store in the DB (trim edge spaces)
    formatted_name = request.company_name.strip()
    job_id = str(uuid.uuid4())
    
    new_job = DBJob(job_id=job_id, company_name=formatted_name, status="PENDING")
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    # Trigger the LangGraph background task
    background_tasks.add_task(run_agent_pipeline, job_id, formatted_name)
    
    return {"job_id": job_id, "status": "PENDING", "company_name": formatted_name}

@app.get("/api/results/{job_id}", response_model=JobResponse)
def get_results(job_id: str, db: Session = Depends(get_db)):
    job = db.query(DBJob).filter(DBJob.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Analysis instance not found")
    return {"job_id": job.job_id, "status": job.status, "company_name": job.company_name, "result_data": job.result_data}

# Add this to your backend/main.py

@app.get("/api/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    completed_jobs = db.query(DBJob).filter(DBJob.status == "COMPLETED").all()
    
    brands = []
    total_score = 0
    total_sentiment = 0

    for job in completed_jobs:
        data = job.result_data or {}
        
        # safely extract score and sentiment
        score = float(data.get("score", 0))
        
        sentiment_data = data.get("sentiment", {})

# 2. Extract the positive value from that inner dictionary
        if isinstance(sentiment_data, dict):
            sentiment_val = sentiment_data.get("positive", 0)
        else:
    # Fallback just in case your AI structure changed
            sentiment_val = 0

# 3. Clean and convert to float
        if isinstance(sentiment_val, str):
            sentiment_val = float(sentiment_val.replace("%", "").strip())
        else:
            sentiment_val = float(sentiment_val)
            
        total_score += score
        total_sentiment += sentiment_val
        

        brands.append({
            "key": job.company_name, # We pass the actual name to trigger the search later
            "name": job.company_name,
            "score": score,
            "sentiment": sentiment_val,
            "marketPosition": data.get("marketPosition", "Challenger") # Fallback if missing
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

from fastapi import Body

@app.post("/api/comparison")
def get_comparison_matrix(company_names: list[str] = Body(...), db: Session = Depends(get_db)):
    if not company_names:
        return []
        
    # Query database for all companies matching items in our list
    # Using OR and ILIKE to handle flexible capitalization safely
    conditions = [DBJob.company_name.ilike(name.strip()) for name in company_names]
    from sqlalchemy import or_
    
    jobs = db.query(DBJob).filter(
        DBJob.status == "COMPLETED",
        or_(*conditions)
    ).all()
    
    matrix_data = []
    for job in jobs:
        data = job.result_data or {}
        
        # Safely capture nested sentiment
        sentiment_data = data.get("sentiment", {})
        sentiment_val = sentiment_data.get("positive", 0) if isinstance(sentiment_data, dict) else 0
        if isinstance(sentiment_val, str):
            sentiment_val = float(sentiment_val.replace("%", "").strip())
            
        # Parse citations safely
        sources_list = []
        for src in data.get("actual_sources", data.get("sources", [])):
            sources_list.append({
                "title": src.get("name", "Official Reference"),
                "url": src.get("url", "#"),
               
            })
            
        # Standardize the data payload to exactly match what ComparisonView expects
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
    # This matches the exact lowercase key in the screenshot
    deleted_count = db.query(DBJob).filter(DBJob.company_name == "Starbucks® Rewards").delete()
    db.commit()
    return {"status": "success", "deleted_rows": deleted_count}

@app.get("/api/companies/search")
def search_companies(q: str = "", db: Session = Depends(get_db)):
    if not q.strip():
        return []
        
    # Query database for matching completed names
    results = db.query(DBJob.company_name).filter(
        DBJob.status == "COMPLETED",
        DBJob.company_name.ilike(f"%{q.strip()}%")
    ).distinct().limit(5).all()
    
    # Flatten the tuple results list: [("Starbucks",), ("Delta",)] -> ["Starbucks", "Delta"]
    return [r[0] for r in results]