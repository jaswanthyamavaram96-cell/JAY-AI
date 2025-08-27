from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..core.security import get_password_hash, verify_password, create_access_token, decode_token
from ..db import get_db
from ..models.user import UserCreate as UserCreateModel, UserInDB, UserOut

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class UserCreate(BaseModel):
	name: str
	email: EmailStr
	password: str

class Token(BaseModel):
	access_token: str
	token_type: str = "bearer"

@router.post("/signup", response_model=Token)
async def signup(payload: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
	email = payload.email.strip().lower()
	name = payload.name.strip()
	if not name:
		raise HTTPException(status_code=400, detail="Name required")
	existing = await db.users.find_one({"email": email})
	if existing:
		raise HTTPException(status_code=400, detail="User already exists")
	user = UserInDB(name=name, email=email, password_hash=get_password_hash(payload.password))
	res = await db.users.insert_one(user.model_dump(by_alias=True))
	token = create_access_token(email)
	return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncIOMotorDatabase = Depends(get_db)):
	email = form_data.username.strip().lower()
	user = await db.users.find_one({"email": email})
	if not user or not verify_password(form_data.password, user.get("password_hash", "")):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
	token = create_access_token(email)
	return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def me(token: str = Depends(oauth2_scheme), db: AsyncIOMotorDatabase = Depends(get_db)):
	email = decode_token(token)
	if not email:
		raise HTTPException(status_code=401, detail="Invalid token")
	doc = await db.users.find_one({"email": email})
	if not doc:
		raise HTTPException(status_code=404, detail="User not found")
	return UserOut(id=str(doc.get("_id")), name=doc.get("name"), email=doc.get("email"), created_at=doc.get("created_at"))