from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import httpx
from ..core.settings import settings

router = APIRouter()

class SongGenRequest(BaseModel):
	prompt: str
	provider: Optional[str] = None

class SongGenResponse(BaseModel):
	song_url: str
	provider: str
	metadata: Dict[str, Any] = {}

async def suno_song(prompt: str) -> Dict[str, str]:
	headers = {"Authorization": f"Bearer {settings.SUNO_API_KEY}", "Content-Type": "application/json"}
	body = {"prompt": prompt}
	async with httpx.AsyncClient(timeout=120) as client:
		resp = await client.post("https://api.suno.ai/v1/generate", headers=headers, json=body)
		resp.raise_for_status()
		data = resp.json()
		return {"url": data.get("url"), "title": data.get("title", "Jay AI song")}

@router.post("/generate", response_model=SongGenResponse)
async def generate_song(req: SongGenRequest):
	p = req.prompt.strip()
	if not p:
		raise HTTPException(status_code=400, detail="Prompt required")
	prov = (req.provider or ("suno" if settings.SUNO_API_KEY else "demo")).lower()
	try:
		if prov == "suno" and settings.SUNO_API_KEY:
			res = await suno_song(p)
			return SongGenResponse(song_url=res["url"], provider="suno", metadata={"title": res.get("title")})
		return SongGenResponse(song_url="/static/songs/demo.mp3", provider="demo", metadata={"title": "Jay AI demo track"})
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))