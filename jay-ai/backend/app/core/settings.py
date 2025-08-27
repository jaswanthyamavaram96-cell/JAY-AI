from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
	model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
	# Security
	JWT_SECRET: str = "change-me"
	JWT_EXPIRE_MINUTES: int = 60 * 24
	# Database
	DB_URI: Optional[str] = None
	DB_NAME: str = "jayai"
	# CORS
	FRONTEND_ORIGIN: str = "*"
	# Integrations
	GOOGLE_API_KEY: Optional[str] = None
	SEARCH_ENGINE_ID: Optional[str] = None
	OPENAI_API_KEY: Optional[str] = None
	STABILITY_API_KEY: Optional[str] = None
	RUNWAY_API_KEY: Optional[str] = None
	SUNO_API_KEY: Optional[str] = None

settings = Settings()