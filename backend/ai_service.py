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
    "temperature": 0.4,
    "top_p": 0.9,
    "max_output_tokens": 4096,
    "response_mime_type": "application/json"
}


model = genai.GenerativeModel("gemini-2.0-flash", generation_config=generation_config)

PROMPT_TEMPLATE = """
Act as a world-class venture capitalist and pitch coach.
Analyze the pitch below and provide a structured evaluation in JSON format.

RULES:
1. Scores are integers (0-10).
2. Strengths/Weaknesses/Suggestions: Exactly 3 bullet points each, max 15 words per bullet.
3. improved_pitch: Maximum 100 words. Be professional, punchy, and clear.
4. Output MUST be valid JSON and ONLY JSON. No preamble.

Pitch:
"{pitch_text}"

Response Schema:
{{
"scores": {{
"clarity": int, "problem_definition": int, "solution_explanation": int, "technical_depth": int, "innovation": int, "impact": int, "logical_flow": int, "persuasiveness": int
}},
"overall_score": float,
"strengths": ["concise bullet", "concise bullet", "concise bullet"],
"weaknesses": ["concise bullet", "concise bullet", "concise bullet"],
"suggestions": ["concise bullet", "concise bullet", "concise bullet"],
"improved_pitch": "Refined professional pitch (max 100 words)"
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
                timeout=30.0 # 30 seconds timeout
            )
            
            # --- INSPECTION START ---
            try:
                if not response.candidates:
                    logger.error("Gemini returned NO candidates.")
                    continue
                    
                finish_reason = response.candidates[0].finish_reason
                if finish_reason.name == "MAX_TOKENS":
                    logger.warning("Response truncated by MAX_TOKENS limit!")
                
            except Exception as debug_err:
                logger.error(f"Error inspecting response object: {debug_err}")
            # --- INSPECTION END ---

            try:
                raw_text = response.text
            except Exception as text_err:
                 logger.error(f"Failed to access response.text: {text_err}")
                 try:
                     raw_text = response.candidates[0].content.parts[0].text
                 except:
                     raw_text = ""
                     
            cleaned_text = clean_json_string(raw_text)
            
            # Robust Truncation Detection
            if not cleaned_text.strip().endswith("}"):
                logger.warning("Detected potential JSON truncation from model output.")
                # Attempt to close the JSON if it's just missing the end
                if cleaned_text.count("{") > cleaned_text.count("}"):
                     cleaned_text += '" }' # Minimal patch to attempt parsing if just trailing quote/brace missing
            
            try:
                data = json.loads(cleaned_text)
                
                # Recalculate score logic
                if "scores" in data:
                     data["scores"] = validate_scores(data["scores"])
                     data["overall_score"] = calculate_overall_score(data["scores"])
                
                return data
                
            except json.JSONDecodeError as e:
                logger.error(f"JSON Parse Error (Attempt {attempt+1}): {e}")
                logger.debug(f"Offending text: {cleaned_text}")
                
                if attempt == retries - 1:
                    # Final attempt failed
                    error_msg = "Output truncated by AI" if "logical_flow" in cleaned_text and "}" not in cleaned_text else str(e)
                    raise ValueError(f"Failed to parse AI response: {error_msg}")
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
                logger.error(f"Gemini API Critical Failure: {e}")
                
                error_response = MOCK_ANALYSIS_RESULT.copy()
                error_response["improved_pitch"] = f"⚠️ ANALYSIS FAILED: {str(e)}\n\nPlease try a slightly shorter or different pitch."
                
                return error_response
            continue

    raise HTTPException(status_code=500, detail="Failed to analyze pitch after retries.")

# Mock Data for Fallback/Demo Mode
MOCK_ANALYSIS_RESULT = {
    "scores": {
        "clarity": 8,
        "problem_definition": 9,
        "solution_explanation": 7,
        "technical_depth": 8,
        "innovation": 9,
        "impact": 8,
        "logical_flow": 8,
        "persuasiveness": 7
    },
    "overall_score": 8.0,
    "strengths": [
        "Strong problem definition with clear user pain points.",
        "Innovative approach using AI for real-time feedback.",
        "Solid technical feasibility outlined."
    ],
    "weaknesses": [
        "Monetization strategy is vague.",
        "Competitive analysis could be deeper.",
        "Go-to-market plan lacks specifics."
    ],
    "suggestions": [
        "Elaborate on your subscription model.",
        "Compare directly with existing competitors.",
        "Define your initial target audience more clearly."
    ],
    "improved_pitch": "Refined Pitch: [DEMO MODE] ... (This is a simulated improvement to demonstrate the UI) ..."
}
