import uuid
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, SessionLocal, Base, DBJob, init_db
from schema import AnalysisRequest, JobResponse
from agents import run_loyalty_analysis

# Build tables locally
init_db()
app = FastAPI(title="Loyalty Lens API Engine")

# Handle CORS configuration for frontend frameworks
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

# Async worker processing pipeline
def run_agent_pipeline(job_id: str, company_name: str):
    db = SessionLocal()
    job = db.query(DBJob).filter(DBJob.job_id == job_id).first()
    
    if job:
        job.status = "PROCESSING"
        db.commit()
        
        try:
            final_report = run_loyalty_analysis(company_name)
            
            if isinstance(final_report, dict) and final_report.get("status") == "FAILED":
                job.status = "FAILED"
                job.result_data = {"errors": final_report.get("errors")}
            else:
                job.status = "COMPLETED"
                job.result_data = final_report
        except Exception as e:
            job.status = "FAILED"
            job.result_data = {"error": str(e)}
            
        db.commit()
    db.close()

@app.post("/api/analyze", response_model=JobResponse)
def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    job_id = str(uuid.uuid4())
    
    new_job = DBJob(job_id=job_id, company_name=request.company_name, status="PENDING")
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    background_tasks.add_task(run_agent_pipeline, job_id, request.company_name)
    return {"job_id": job_id, "status": "PENDING", "company_name": request.company_name}

@app.get("/api/results/{job_id}", response_model=JobResponse)
def get_results(job_id: str, db: Session = Depends(get_db)):
    job = db.query(DBJob).filter(DBJob.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Analysis instance not found")
    return {"job_id": job.job_id, "status": job.status, "company_name": job.company_name, "result_data": job.result_data}