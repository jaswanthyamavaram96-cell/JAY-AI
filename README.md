# Jay AI (React + FastAPI)

Modern, professional, and futuristic AI assistant. Frontend: React (Vite, TS, Tailwind). Backend: FastAPI with JWT auth and MongoDB.

## Prerequisites
- Node.js 18+
- Python 3.11+ (uvicorn)
- MongoDB Atlas (or compatible) for production

## Setup
1) Copy env
```bash
cp .env.example backend/.env
# edit backend/.env with real keys and DB URI
```

2) Install frontend
```bash
cd jay-ai/frontend
npm i
npm run dev
```

3) Install backend deps and run
```bash
/workspace/jay-ai/backend/.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
```

- Frontend dev server: http://localhost:5173
- Backend API: http://localhost:8001

## Environment variables (backend/.env)
- JWT_SECRET, JWT_EXPIRE_MINUTES
- DB_URI, DB_NAME
- FRONTEND_ORIGIN
- GOOGLE_API_KEY, SEARCH_ENGINE_ID
- OPENAI_API_KEY, STABILITY_API_KEY, RUNWAY_API_KEY, SUNO_API_KEY

## Deploy
- Backend (Render/Heroku/Fly.io): build a Python service, set env vars, start command:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
- Frontend (Vercel/Netlify): deploy `frontend` build
```bash
cd jay-ai/frontend && npm run build
```
Set `VITE_API_BASE` to your API URL.

## Notes
- QA uses Google CSE + OpenAI if keys configured; otherwise returns guidance.
- Image/Video/Song routes integrate providers if keys exist, else fallback to demo media.
- Auth uses MongoDB via Motor; replace indexes and validation as needed for production.