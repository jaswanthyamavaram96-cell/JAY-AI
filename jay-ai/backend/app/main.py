from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers import auth, qa, images, videos, songs
from .core.settings import settings

app = FastAPI(title="Jay AI API", version="0.2.0")

origins = [settings.FRONTEND_ORIGIN] if settings.FRONTEND_ORIGIN else ["*"]
app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(qa.router, prefix="/qa", tags=["qa"])
app.include_router(images.router, prefix="/images", tags=["images"])
app.include_router(videos.router, prefix="/videos", tags=["videos"])
app.include_router(songs.router, prefix="/songs", tags=["songs"])

@app.get("/")
def root():
	return {"status": "ok", "service": "jay-ai"}