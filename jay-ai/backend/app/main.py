from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, qa, images, videos, songs

app = FastAPI(title="Jay AI API", version="0.1.0")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(qa.router, prefix="/qa", tags=["qa"])
app.include_router(images.router, prefix="/images", tags=["images"])
app.include_router(videos.router, prefix="/videos", tags=["videos"])
app.include_router(songs.router, prefix="/songs", tags=["songs"])

@app.get("/")
def root():
	return {"status": "ok", "service": "jay-ai"}