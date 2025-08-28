from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import httpx
from ..core.settings import settings

router = APIRouter()

class ImageGenRequest(BaseModel):
	prompt: str
	size: str = "1024x1024"
	style: Optional[str] = None
	provider: Optional[str] = None

class ImageGenResponse(BaseModel):
	image_url: str
	provider: str

async def openai_image(prompt: str, size: str) -> str:
	headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}", "Content-Type": "application/json"}
	body = {"model": "gpt-image-1", "prompt": prompt, "size": size}
	async with httpx.AsyncClient(timeout=60) as client:
		resp = await client.post("https://api.openai.com/v1/images/generations", headers=headers, json=body)
		resp.raise_for_status()
		data = resp.json()
		return data["data"][0]["url"]

async def stability_image(prompt: str, size: str, style: Optional[str]) -> str:
	headers = {"Authorization": f"Bearer {settings.STABILITY_API_KEY}"}
	json = {"prompt": prompt, "size": size}
	if style:
		json["style_preset"] = style
	async with httpx.AsyncClient(timeout=60) as client:
		resp = await client.post("https://api.stability.ai/v2beta/stable-image/generate", headers=headers, json=json)
		resp.raise_for_status()
		data = resp.json()
		return data.get("image_url") or data.get("artifacts", [{}])[0].get("url")

@router.post("/generate", response_model=ImageGenResponse)
async def generate_image(req: ImageGenRequest):
	p = req.prompt.strip()
	if not p:
		raise HTTPException(status_code=400, detail="Prompt required")
	prov = (req.provider or ("openai" if settings.OPENAI_API_KEY else "stability" if settings.STABILITY_API_KEY else "demo")).lower()
	try:
		if prov == "openai" and settings.OPENAI_API_KEY:
			url = await openai_image(p, req.size)
			return ImageGenResponse(image_url=url, provider="openai")
		if prov == "stability" and settings.STABILITY_API_KEY:
			url = await stability_image(p, req.size, req.style)
			return ImageGenResponse(image_url=url, provider="stability")
		# Fallback demo
		return ImageGenResponse(image_url="/static/images/demo.jpg", provider="demo")
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))