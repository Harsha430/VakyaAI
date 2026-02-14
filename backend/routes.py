from fastapi import APIRouter, HTTPException, Path
from schemas import PitchRequest, AnalysisResponse, AnalysisResult
from database import analyses_collection
from ai_service import analyze_pitch_with_gemini
from bson import ObjectId
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/analyze", response_model=AnalysisResponse, status_code=201)
async def analyze_pitch(request: PitchRequest):
    """
    Analyzes a pitch using Gemini AI and stores the result.
    """
    logger.info("Received pitch analysis request.")
    
    # Call AI Service
    try:
        analysis_data = await analyze_pitch_with_gemini(request.pitch_text)
    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error(f"AI Service Failed: {e}")
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=500, content={"detail": f"Internal Error: {str(e)}"})

    # Check for graceful fallback error
    if "error" in analysis_data:
        error_msg = f"{analysis_data['error']} Details: {analysis_data.get('details', 'No details')}"
        logger.error(f"AI Analysis Logic Failed: {analysis_data}")
        raise HTTPException(status_code=503, detail=error_msg)
    
    # Create Document
    document = {
        "original_pitch": request.pitch_text,
        "analysis": analysis_data,
        "created_at": datetime.utcnow()
    }
    
    # Store in MongoDB
    try:
        result = await analyses_collection.insert_one(document)
        document["id"] = str(result.inserted_id)
    except Exception as e:
        logger.error(f"Database Insert Failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to save analysis results.")
        
    return document

@router.get("/analysis/{id}", response_model=AnalysisResponse)
async def get_analysis(id: str = Path(..., title="The ID of the analysis to retrieve")):
    """
    Retrieves a stored analysis by its ID.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid analysis ID format.")
    
    try:
        document = await analyses_collection.find_one({"_id": ObjectId(id)})
    except Exception as e:
        logger.error(f"Database Query Failed: {e}")
        raise HTTPException(status_code=500, detail="Database error.")
        
    if not document:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    
    document["id"] = str(document["_id"])
    return document
