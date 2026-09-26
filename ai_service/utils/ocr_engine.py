import os
import pytesseract
from PIL import Image
import io
import re

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
os.environ['TESSDATA_PREFIX'] = r'C:\Program Files\Tesseract-OCR\tessdata'

def extract_text_from_image(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes))
    return pytesseract.image_to_string(image)

def parse_income_and_caste(text: str):
    text_lower = text.lower()
    
    # 1. Strict ST Verification Logic
    # Must explicitly mention "Scheduled Tribe" or "ST" as the candidate's category, 
    # not just in the boilerplate constitution declaration text.
    is_scheduled_caste = 'scheduled caste' in text_lower or 'belonging to sc' in text_lower
    has_st_mention = any(k in text_lower for k in ['scheduled tribe', 'st category', 'st certificate'])
    
    # If "scheduled caste" is explicitly stated without specific ST confirmation, mark ST as false
    is_st_verified = has_st_mention and not is_scheduled_caste

    # 2. Strict Income Matching Logic
    # Match patterns like: "Annual Income: 4,50,000", "Income Rs. 500000", "Rs 60,000/-"
    # Avoid picking numbers from certificate IDs (e.g. WB11055...)
    income_pattern = r'(?:annual\s*income|family\s*income|income|rs\.?|inr)\s*[:=-]?\s*₹?\s*([\d,]{5,7})'
    income_matches = re.findall(income_pattern, text_lower)
    
    extracted_income = None
    if income_matches:
        try:
            # Clean commas and parse
            income_val = int(income_matches[0].replace(',', ''))
            # Income amounts typically fall within a realistic range
            if 10000 <= income_val <= 2000000:
                extracted_income = income_val
        except ValueError:
            extracted_income = None

    # Calculate Confidence Score
    confidence = 90 if (is_st_verified or extracted_income) else 40

    return {
        "extracted_text": text.replace('\n', ' '), # Clean line breaks for preview
        "extracted_income": extracted_income,
        "is_st_verified": is_st_verified,
        "is_sc_detected": is_scheduled_caste,
        "confidence_score": confidence
    }