from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserInDB(BaseModel):
	id: Optional[str] = Field(default=None, alias="_id")
	name: str
	email: EmailStr
	password_hash: str
	created_at: datetime = Field(default_factory=datetime.utcnow)

	class Config:
		populate_by_name = True
		json_encoders = {datetime: lambda v: v.isoformat()}

class UserCreate(BaseModel):
	name: str
	email: EmailStr
	password: str

class UserOut(BaseModel):
	id: str
	name: str
	email: EmailStr
	created_at: datetime