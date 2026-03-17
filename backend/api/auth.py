from fastapi import APIRouter, HTTPException, Depends, Header, status
from pydantic import BaseModel
from database.mongodb import get_database
from datetime import datetime
from bson import ObjectId
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class UserAuthRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str

async def get_current_user(authorization: str = Header(None), db=Depends(get_database)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not authorization or not authorization.startswith("Bearer "):
        raise credentials_exception
        
    user_id = authorization.split("Bearer ")[1]
    
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        logger.error(f"Invalid user id format: {e}")
        raise credentials_exception
        
    if not user:
        raise credentials_exception
    return user

@router.post("/register", response_model=TokenResponse)
async def register_user(request: UserAuthRequest, db=Depends(get_database)):
    existing_user = await db.users.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered. Please login.")
        
    new_user = {
        "email": request.email,
        "password": request.password,
        "created_at": datetime.utcnow().isoformat(),
        "profile_completed": False
    }
    
    result = await db.users.insert_one(new_user)
    user_id = str(result.inserted_id)
    
    return {"access_token": user_id, "token_type": "bearer", "user_id": user_id}

@router.post("/login", response_model=TokenResponse)
async def login_user(request: UserAuthRequest, db=Depends(get_database)):
    user = await db.users.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="No account previously found. Please register first.")
        
    if user.get("password") != request.password:
        raise HTTPException(status_code=401, detail="Invalid password")
        
    user_id = str(user["_id"])
    return {"access_token": user_id, "token_type": "bearer", "user_id": user_id}
