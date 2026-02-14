import re
import json
import logging

def clean_json_string(json_string):
    """
    Cleans a JSON string from potential markdown formatting or extra characters.
    """
    json_string = re.sub(r'```json\n?', '', json_string)
    json_string = re.sub(r'```', '', json_string)
    return json_string.strip()

def calculate_overall_score(scores: dict) -> float:
    """
    Calculates the average score from a dictionary of scores.
    """
    if not scores:
        return 0.0
    return round(sum(scores.values()) / len(scores), 1)

def validate_scores(scores: dict):
    """
    Ensures all scores are integers between 0 and 10.
    """
    for key, value in scores.items():
        if not isinstance(value, (int, float)):
             scores[key] = 0
        if value < 0:
            scores[key] = 0
        if value > 10:
             scores[key] = 10
    return scores
