from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Dict
from ..core.security import get_password_hash, verify_password, create_access_token, decode_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# In-memory user store for demo; replace with MongoDB
USERS: Dict[str, Dict] = {}

class UserCreate(BaseModel):
	email: EmailStr
	password: str

class Token(BaseModel):
	access_token: str
	token_type: str = "bearer"

@router.post("/signup", response_model=Token)
def signup(payload: UserCreate):
	if payload.email in USERS:
		raise HTTPException(status_code=400, detail="User already exists")
	USERS[payload.email] = {
		"email": payload.email,
		"password_hash": get_password_hash(payload.password),
	}
	token = create_access_token(payload.email)
	return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
	user = USERS.get(form_data.username)
	if not user or not verify_password(form_data.password, user["password_hash"]):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
	token = create_access_token(user["email"]) 
	return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
def me(token: str = Depends(oauth2_scheme)):
	email = decode_token(token)
	if not email:
		raise HTTPException(status_code=401, detail="Invalid token")
	return {"email": email}