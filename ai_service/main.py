from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.ocr_engine import extract_text_from_image, parse_income_and_caste

app = FastAPI(title="MoTA AI Document Verification Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Active", "service": "MoTA OCR Microservice"}

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
    uvicorn.run(app, host="0.0.0.0", port=8000)