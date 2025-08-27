from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .core.settings import settings

_client: Optional[AsyncIOMotorClient] = None
_db: Optional[AsyncIOMotorDatabase] = None

async def get_db() -> AsyncIOMotorDatabase:
	global _client, _db
	if _db is None:
		if not settings.DB_URI:
			raise RuntimeError("DB_URI not configured")
		_client = AsyncIOMotorClient(settings.DB_URI)
		_db = _client[settings.DB_NAME]
	return _db