from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SongGenRequest(BaseModel):
	prompt: str
	model: Optional[str] = "suno"

class SongGenResponse(BaseModel):
	url: str
	provider: str

@router.post("/generate", response_model=SongGenResponse)
def generate_song(req: SongGenRequest):
	if not req.prompt.strip():
		raise HTTPException(status_code=400, detail="Prompt required")
	# TODO: integrate Suno/Udio/Riffusion+TTS
	return SongGenResponse(url="https://cdn.pixabay.com/download/audio/2022/03/15/audio_28b54056c6.mp3?filename=lofi-study-112191.mp3", provider=req.model or "suno")