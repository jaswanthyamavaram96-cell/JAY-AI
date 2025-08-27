from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
from ..core.settings import settings

router = APIRouter()

class QARequest(BaseModel):
	question: str
	top_k: int = 5

class Source(BaseModel):
	title: str
	url: str
	snippet: Optional[str] = None

class QAResponse(BaseModel):
	answer: str
	sources: List[Source]

async def google_search(query: str, top_k: int) -> List[Source]:
	if not settings.GOOGLE_API_KEY or not settings.SEARCH_ENGINE_ID:
		raise RuntimeError("Search API not configured")
	params = {
		"key": settings.GOOGLE_API_KEY,
		"cx": settings.SEARCH_ENGINE_ID,
		"q": query,
	}
	async with httpx.AsyncClient(timeout=20) as client:
		resp = await client.get("https://www.googleapis.com/customsearch/v1", params=params)
		resp.raise_for_status()
		data = resp.json()
		items = data.get("items", [])[: top_k]
		return [Source(title=i.get("title", ""), url=i.get("link", ""), snippet=i.get("snippet")) for i in items]

async def summarize_with_openai(question: str, sources: List[Source]) -> str:
	if not settings.OPENAI_API_KEY:
		return "Search results gathered. Configure OPENAI_API_KEY to enable synthesis."
	context = "\n\n".join([f"- {s.title}: {s.url}\n{(s.snippet or '')}" for s in sources])
	prompt = (
		"You are Jay AI. Read the web results and answer concisely with citations inline as [1], [2]..."
		"If unsure, say so. Question: " + question + "\n\nResults:\n" + context
	)
	headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}", "Content-Type": "application/json"}
	body = {
		"model": "gpt-4o-mini",
		"messages": [
			{"role": "system", "content": "You are a helpful AI that cites sources."},
			{"role": "user", "content": prompt},
		],
	}
	async with httpx.AsyncClient(timeout=30) as client:
		resp = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=body)
		resp.raise_for_status()
		data = resp.json()
		return data["choices"][0]["message"]["content"].strip()

@router.post("/ask", response_model=QAResponse)
async def ask(req: QARequest):
	q = req.question.strip()
	if not q:
		raise HTTPException(status_code=400, detail="Question required")
	if req.top_k < 1 or req.top_k > 10:
		raise HTTPException(status_code=400, detail="top_k must be between 1 and 10")
	try:
		sources = await google_search(q, req.top_k)
		answer = await summarize_with_openai(q, sources)
		req_sources = [s for s in sources]
		return QAResponse(answer=answer, sources=req_sources)
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))