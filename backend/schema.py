# backend/schema.py
from pydantic import BaseModel, Field
from typing import List, Optional

class Tier(BaseModel):
    name: str = Field(description="Name of the membership tier (e.g., Gold, Silver)")
    requirement: str = Field(description="What it takes to reach this tier")
    benefit: str = Field(description="The main perks of this tier")

class Theme(BaseModel):
    text: str = Field(description="A short paragraph describing the theme (e.g., 'Free Shipping')")
    value: int = Field(description="A score out of 100 representing sentiment")

class Metadata(BaseModel):
    generated: str = Field(default="The date of generation of the response")
    confidence: str = Field(description="the confidence that the information is accurate")
    sources: int = Field(description="Number of web sources analyzed")
    
class Summary(BaseModel):
    executiveSummary: str = Field(description="A 2-3 sentence overview of the program")
    keyFindings: List[str] = Field(description="4 bullet points of the most important findings")
    metadata: Metadata

# This perfectly matches what your React frontend expects
class LoyaltyReport(BaseModel):
    key: str = Field(description="Company name in lowercase, no spaces")
    name: str = Field(description="Official name of the rewards program")
    score: int = Field(description="Overall program score out of 100")
    marketPosition: str = Field(description="Either 'Leader', 'Challenger', or 'Niche'")
    sentiment: int = Field(description="Customer sentiment score out of 100")
    confidence: int = Field(description="AI confidence score out of 100")
    
    tiers: List[Tier]
    
    earnRate: str = Field(description="A single sentence describing how users earn points")
    redemption: str = Field(description="A single sentence describing how users spend points")
    strengths: str = Field(description="A short paragraph about the program's strengths")
    weaknesses: str = Field(description="A short paragraph about the program's weaknesses")
    
    positiveThemes: List[Theme]
    negativeThemes: List[Theme]
    
    summary: Summary

# Add this to the bottom of backend/schema.py

class AnalysisRequest(BaseModel):
    company_name: str

class JobResponse(BaseModel):
    job_id: str
    status: str
    company_name: str
    result_data: Optional[dict] = None