# backend/schema.py
from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Literal


class SentimentBreakdown(BaseModel):
    positive: int = Field(
        description="Score representing the proportion of positive sentiment. Look for explicit praise regarding: high financial ROI, successful and easy reward redemptions, excellent customer service experiences, app reliability, tier upgrade excitement, and genuine brand loyalty."
    )
    
    negative: int = Field(
        description="Score representing the proportion of negative or frustrated sentiment. Look for complaints regarding: program devaluations (requiring more points for the same reward), hidden rules or blackout dates, unfair point expirations, buggy app experiences, and unhelpful customer support."
    )
    
    neutral: int = Field(
        description="Score representing the proportion of neutral or objective sentiment. Look for: factual questions about how program mechanics work, sharing referral codes or news without commentary, objective comparisons of tier benefits, or comments that balance pros and cons equally."
    )

    @model_validator(mode='after')
    def scale_to_100(self):
        # Calculates the total of the LLM's raw output
        total = self.positive + self.negative + self.neutral
        
        # Mathematically scales the numbers to guarantee a perfect 100% total
        if total > 0 and total != 100:
            self.positive = round((self.positive / total) * 100)
            self.negative = round((self.negative / total) * 100)
            self.neutral = 100 - (self.positive + self.negative)
            
        return self


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
    score: int = Field(description="Assign a score from 0 to 100 evaluating the loyalty program's value. Base the score on: 1) clarity of earning/redeeming points, 2) value of tier benefits, and 3) sign-up incentives found on the official webpage.")
    marketPosition:Literal["Leader", "Challenger", "Niche"] = Field(description="Categorize the brand's status in the market.")
    sentiment: SentimentBreakdown = Field(
        description="Analyze the Reddit source and provide a proportional breakdown of the overall sentiment. Evaluate the text based on financial value, ease of use, and emotional connection to the loyalty program."
    )
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