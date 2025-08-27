# Jay AI Backend (FastAPI)

## Run locally
```bash
cd /workspace/jay-ai/backend
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## Auth
- POST `/auth/signup` { email, password }
- POST `/auth/login` (OAuth2 password form) -> access_token
- GET `/auth/me` with `Authorization: Bearer <token>`

## APIs
- POST `/qa/ask` { question, top_k }
- POST `/images/generate` { prompt }
- POST `/videos/generate` { prompt }
- POST `/songs/generate` { prompt }

Integrations are mocked; wire real providers via `.env`:
```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_CSE_ID=
GOOGLE_API_KEY=
BING_API_KEY=
STABILITY_API_KEY=
RUNWAY_API_KEY=
SUNO_API_KEY=
JWT_SECRET=
MONGODB_URI=
```