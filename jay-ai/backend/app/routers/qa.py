from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..core.security import decode_token

router = APIRouter()

class QARequest(BaseModel):
	question: str
	top_k: int = 3
	token: Optional[str] = None

class QAResponse(BaseModel):
	answer: str
	sources: List[str]

@router.post("/ask", response_model=QAResponse)
def ask(req: QARequest):
	if not req.question.strip():
		raise HTTPException(status_code=400, detail="Question required")
	# Simulated aggregation across sources. Replace with real calls to search + LLMs.
	sources = [
		"google:result-123",
		"bing:result-456",
		"chatgpt:analysis-abc",
		"claude:analysis-def",
	]
	answer = (
		"Jay AI aggregates multiple sources (Google, Bing, ChatGPT, Claude, Gemini, Perplexity) "
		"to produce a reliable, cited answer."
	)
	return QAResponse(answer=answer, sources=sources[: req.top_k])