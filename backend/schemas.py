from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
from datetime import datetime

class PitchRequest(BaseModel):
    pitch_text: str = Field(..., min_length=10, max_length=15000, description="The text of the pitch to analyze.")

class AnalysisScores(BaseModel):
    clarity: int
    problem_definition: int
    solution_explanation: int
    technical_depth: int
    innovation: int
    impact: int
    logical_flow: int
    persuasiveness: int

class AnalysisResult(BaseModel):
    scores: AnalysisScores
    overall_score: float
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    improved_pitch: str

class AnalysisResponse(BaseModel):
    id: str
    original_pitch: str
    analysis: AnalysisResult
    created_at: datetime
    
    class Config:
        from_attributes = True

class ErrorResponse(BaseModel):
    detail: str
