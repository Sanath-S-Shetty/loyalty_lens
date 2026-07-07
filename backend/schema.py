from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# --- API Communication Schemas ---
class AnalysisRequest(BaseModel):
    company_name: str

class JobResponse(BaseModel):
    job_id: str
    status: str
    company_name: str
    result_data: Optional[Dict[str, Any]] = None

# --- Gemini AI Output Schemas (For the final report) ---
class Tier(BaseModel):
    name: str
    requirements: str
    benefits: List[str]

class LoyaltyProgramReport(BaseModel):
    company_name: str
    membership_tiers: List[Tier]
    earning_mechanisms: List[str]
    redemption_policies: List[str]
    sentiment_score: float
    strengths: List[str]
    weaknesses: List[str]