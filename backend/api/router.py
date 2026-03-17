from fastapi import APIRouter
from api.symptoms import router as symptoms_router
from api.user import router as user_router
from api.auth import router as auth_router

api_router = APIRouter()

api_router.include_router(symptoms_router, prefix="/symptoms", tags=["symptoms"])
api_router.include_router(user_router, prefix="/user", tags=["user"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
