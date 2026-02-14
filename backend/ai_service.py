import os
import json
import google.generativeai as genai
from fastapi import HTTPException
from dotenv import load_dotenv
import logging
import asyncio
from schemas import AnalysisResult
from utils import clean_json_string, calculate_overall_score, validate_scores

load_dotenv()

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=GEMINI_API_KEY)

# Gemini Model Configuration
generation_config = {
    "temperature": 0.3,
    "top_p": 0.9,
    "max_output_tokens": 2048,
    "response_mime_type": "application/json"
}

model = genai.GenerativeModel("gemini-1.5-flash", generation_config=generation_config)

PROMPT_TEMPLATE = """
You are an expert technical pitch evaluator and venture competition jury member.
Evaluate the following pitch using strict scoring criteria.

Scoring Categories (0–10):
Clarity, Problem Definition, Solution Explanation, Technical Depth, Innovation, Impact Quantification, Logical Flow, Persuasiveness

Instructions:
1. Be objective and do not inflate scores.
2. Identify missing structural elements.
3. Suggest concrete improvements.
4. Rewrite pitch professionally.
5. Return STRICTLY VALID JSON.

Pitch:
"{pitch_text}"

JSON Schema:
{{
"scores": {{
"clarity": int,
"problem_definition": int,
"solution_explanation": int,
"technical_depth": int,
"innovation": int,
"impact": int,
"logical_flow": int,
"persuasiveness": int
}},
"overall_score": float,
"strengths": [str],
"weaknesses": [str],
"suggestions": [str],
"improved_pitch": str
}}
"""

async def analyze_pitch_with_gemini(pitch_text: str) -> dict:
    prompt = PROMPT_TEMPLATE.format(pitch_text=pitch_text)
    
    retries = 2
    for attempt in range(retries):
        try:
            # Add timeout protection
            response = await asyncio.wait_for(
                model.generate_content_async(prompt),
                timeout=15.0 # 15 seconds timeout
            )
            
            raw_text = response.text
            cleaned_text = clean_json_string(raw_text)
            
            try:
                data = json.loads(cleaned_text)
                
                # Recalculate score logic as requested to verify
                if "scores" in data:
                     data["scores"] = validate_scores(data["scores"])
                     data["overall_score"] = calculate_overall_score(data["scores"])
                
                return data
                
            except json.JSONDecodeError as e:
                logger.error(f"JSON Parse Error (Attempt {attempt+1}): {e}")
                if attempt == retries - 1:
                    raise ValueError("Failed to parse AI response")
                continue # Retry
                
        except asyncio.TimeoutError:
            logger.error(f"Gemini API Timeout (Attempt {attempt+1})")
            if attempt == retries - 1:
                 raise HTTPException(status_code=504, detail="AI processing timed out. Please try again.")
            continue
            
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            if attempt == retries - 1:
                # Graceful Fallback
                return {
                    "error": "AI evaluation temporarily unavailable. Please retry.",
                    "details": str(e)
                }
            continue

    raise HTTPException(status_code=500, detail="Failed to analyze pitch after retries.")
