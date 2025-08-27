from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ImageGenRequest(BaseModel):
	prompt: str
	model: Optional[str] = "stability-ai"

class ImageGenResponse(BaseModel):
	url: str
	provider: str

@router.post("/generate", response_model=ImageGenResponse)
def generate_image(req: ImageGenRequest):
	if not req.prompt.strip():
		raise HTTPException(status_code=400, detail="Prompt required")
	# TODO: integrate Stability AI / DALL·E; return signed URL or base64
	return ImageGenResponse(url="https://picsum.photos/seed/jayai/1024/768", provider=req.model or "stability-ai")