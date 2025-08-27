from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class VideoGenRequest(BaseModel):
	prompt: str
	model: Optional[str] = "runway"

class VideoGenResponse(BaseModel):
	url: str
	provider: str

@router.post("/generate", response_model=VideoGenResponse)
def generate_video(req: VideoGenRequest):
	if not req.prompt.strip():
		raise HTTPException(status_code=400, detail="Prompt required")
	# TODO: integrate Runway/Pika or open-source video diffusion
	return VideoGenResponse(url="https://cdn.coverr.co/videos/coverr-circuit-board-technology-3478/1080p.mp4", provider=req.model or "runway")