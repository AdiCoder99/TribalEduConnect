import os

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from utils.ocr_engine import extract_text_from_image, parse_income_and_caste
from rag_service import answer_query

load_dotenv()

app = FastAPI(title="MoTA AI and Scholarship Guidance Service")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("AI_CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Active", "service": "MoTA AI and Scholarship Guidance Service"}


class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=500)


@app.post("/api/rag/chat")
async def chat(request: ChatRequest):
    return {"success": True, **answer_query(request.message)}

@app.post("/api/ocr/verify-document")
async def verify_document(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/") and file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image or PDF.")
    
    try:
        contents = await file.read()
        raw_text = extract_text_from_image(contents)
        result = parse_income_and_caste(raw_text)
        
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=os.getenv("AI_SERVICE_HOST", "0.0.0.0"),
        port=int(os.getenv("AI_SERVICE_PORT", "8000")),
    )