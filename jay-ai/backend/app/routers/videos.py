from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import httpx
from ..core.settings import settings

router = APIRouter()

class VideoGenRequest(BaseModel):
	prompt: str
	provider: Optional[str] = None

class VideoGenResponse(BaseModel):
	video_url: str
	provider: str

async def runway_video(prompt: str) -> str:
	headers = {"Authorization": f"Bearer {settings.RUNWAY_API_KEY}", "Content-Type": "application/json"}
	body = {"prompt": prompt}
	async with httpx.AsyncClient(timeout=120) as client:
		resp = await client.post("https://api.runwayml.com/v1/videos", headers=headers, json=body)
		resp.raise_for_status()
		data = resp.json()
		return data.get("url")

@router.post("/generate", response_model=VideoGenResponse)
async def generate_video(req: VideoGenRequest):
	p = req.prompt.strip()
	if not p:
		raise HTTPException(status_code=400, detail="Prompt required")
	prov = (req.provider or ("runway" if settings.RUNWAY_API_KEY else "demo")).lower()
	try:
		if prov == "runway" and settings.RUNWAY_API_KEY:
			url = await runway_video(p)
			return VideoGenResponse(video_url=url, provider="runway")
		return VideoGenResponse(video_url="/static/videos/demo.mp4", provider="demo")
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))