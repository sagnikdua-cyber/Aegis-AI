from fastapi import APIRouter, HTTPException, Depends
from models.schemas import UserProfile, APIResponse
from database.mongodb import get_database
from api.auth import get_current_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/profile", response_model=APIResponse)
async def save_profile(profile: UserProfile, current_user = Depends(get_current_user), db = Depends(get_database)):
    try:
        # Update user record with profile data
        await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": {
                "profile": profile.dict(),
                "profile_completed": True
            }}
        )
        return APIResponse(status="success", message="Profile saved successfully")
    except Exception as e:
        logger.error(f"Error saving profile: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/profile", response_model=UserProfile)
async def get_profile(current_user = Depends(get_current_user)):
    try:
        if "profile" in current_user:
            return UserProfile(**current_user["profile"])
        # Return empty if incomplete
        return UserProfile(name="", age=0)
    except Exception as e:
        logger.error(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
