import pytesseract
from PIL import Image
import io
import re

# Set path to Tesseract executable if needed (e.g., Windows: r'C:\Program Files\Tesseract-OCR\tesseract.exe')
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_image(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes))
    extracted_text = pytesseract.image_to_string(image)
    return extracted_text

def parse_income_and_caste(text: str):
    """
    Parses OCR text to find ST caste mentions and numeric income values.
    """
    text_lower = text.lower()
    
    # Check for ST / Tribe mentions
    is_st_verified = any(keyword in text_lower for keyword in ['scheduled tribe', 'st category', 'st certificate', 'tribe'])
    
    # Match annual income amounts using Regex (e.g., Rs. 4,50,000 or 450000)
    income_matches = re.findall(r'(?:rs\.?|inr|income|amount)?\s*:?\s*₹?\s*([\d,]{5,7})', text_lower)
    
    extracted_income = None
    if income_matches:
        # Clean commas and parse to integer
        income_str = income_matches[0].replace(',', '')
        try:
            extracted_income = int(income_str)
        except ValueError:
            extracted_income = None

    # Calculate basic confidence score based on key term presence
    confidence = 85 if is_st_verified or extracted_income else 50

    return {
        "extracted_text": text[:300], # First 300 chars preview
        "extracted_income": extracted_income,
        "is_st_verified": is_st_verified,
        "confidence_score": confidence
    }