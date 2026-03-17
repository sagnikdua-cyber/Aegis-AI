from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Depends
from models.schemas import (
    SymptomAnalysisRequest, SymptomAnalysisResponse, 
    InjuryDetectionResponse, HospitalInfo, PharmacyInfo,
    FirstAidRequest, FirstAidResponse,
    MedicalSummaryRequest, MedicalSummaryResponse,
    UserProfile, AlertRequest, APIResponse, ConfigTestResponse,
    StructuredReportRequest, StructuredReportResponse
)
from config.settings import GEMINI_API_KEY, MONGODB_URI
from services.symptom_service import SymptomAnalyzer
from services.image_service import ImageService
from services.location_service import LocationService
from services.first_aid_service import FirstAidService
from services.summary_service import SummaryService
from database.mongodb import get_database
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Service Initializations
symptom_analyzer = SymptomAnalyzer()
image_service = ImageService()
location_service = LocationService()
first_aid_service = FirstAidService()
summary_service = SummaryService()

@router.post("/analyze-symptoms", response_model=SymptomAnalysisResponse)
async def analyze_symptoms(request: SymptomAnalysisRequest):
    try:
        logger.info(f"Analyzing symptoms: {request.symptoms_text[:50]}...")
        result = await symptom_analyzer.analyze(request.symptoms_text, request.user_profile)
        return SymptomAnalysisResponse(**result)
    except Exception as e:
        logger.error(f"Error in analyze-symptoms: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error during symptom analysis")

@router.post("/detect-injury", response_model=InjuryDetectionResponse)
async def detect_injury(file: UploadFile = File(...)):
    try:
        logger.info(f"Detecting injury from file: {file.filename}")
        contents = await file.read()
        result = await image_service.detect_injury(contents)
        return InjuryDetectionResponse(
            injury_type=result["injury_type"],
            severity=result["severity"],
            recommended_actions=result["recommended_actions"]
        )
    except Exception as e:
        logger.error(f"Error in detect-injury: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing image")

@router.get("/nearby-hospitals", response_model=list[HospitalInfo])
async def get_nearby_hospitals(lat: float = Query(...), lng: float = Query(...)):
    try:
        return await location_service.get_nearby_hospitals(lat, lng)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching hospitals")

@router.get("/nearby-pharmacies", response_model=list[PharmacyInfo])
async def get_nearby_pharmacies(lat: float = Query(...), lng: float = Query(...)):
    try:
        return await location_service.get_nearby_pharmacies(lat, lng)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching pharmacies")

@router.post("/generate-first-aid", response_model=FirstAidResponse)
async def generate_first_aid(request: FirstAidRequest):
    try:
        instructions = await first_aid_service.get_instructions(request.symptoms)
        return FirstAidResponse(instructions=instructions)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error generating first aid")

@router.post("/generate-medical-summary", response_model=MedicalSummaryResponse)
async def generate_medical_summary(request: MedicalSummaryRequest):
    try:
        summary = summary_service.generate_summary(request.dict())
        return MedicalSummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error generating summary")

@router.post("/save-user-profile", response_model=APIResponse)
async def save_user_profile(profile: UserProfile, db = Depends(get_database)):
    try:
        await db.profiles.insert_one(profile.dict())
        return APIResponse(status="success", message="Profile saved successfully")
    except Exception as e:
        logger.error(f"DB Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error")

@router.post("/alert-emergency-contact", response_model=APIResponse)
async def alert_contact(request: AlertRequest):
    try:
        msg = f"EMERGENCY SOS: {request.risk_level} severity detected at {request.location}. Symptoms: {', '.join(request.symptoms)}. Notify: {request.contact_phone}"
        logger.warning(msg)
        # Simulate notification logic
        return APIResponse(status="sent", message=f"SOS Alert broadcasted to {request.contact_phone} for {request.risk_level} situation.")
    except Exception as e:
        logger.error(f"Alert system error: {e}")
        raise HTTPException(status_code=500, detail="Alert system error")

@router.get("/test-config", response_model=ConfigTestResponse)
async def test_config():
    return ConfigTestResponse(
        gemini_api_loaded=bool(GEMINI_API_KEY and not GEMINI_API_KEY.startswith("your_")),
        mongodb_uri_loaded=bool(MONGODB_URI and "mongodb" in MONGODB_URI and not "<db_password>" in MONGODB_URI)
    )

@router.post("/generate-structured-report", response_model=StructuredReportResponse)
async def generate_structured_report(request: StructuredReportRequest):
    try:
        # 1. Generate Summary
        summary = summary_service.generate_patient_summary(
            request.symptoms, request.risk_level, request.detected_injuries
        )
        
        # 2. Get Conditions and First Aid
        analysis = await symptom_analyzer.analyze(request.symptoms)
        first_aid = await first_aid_service.get_instructions(request.symptoms)
        
        # 3. Get Specific Action Plan
        action_plan = await summary_service.generate_action_plan(
            request.symptoms, request.risk_level, request.detected_injuries
        )
        
        # 4. Get Locations if coordinates provided
        hospitals = []
        pharmacies = []
        if request.location:
            hospitals = await location_service.get_nearby_hospitals(
                request.location.latitude, request.location.longitude
            )
            pharmacies = await location_service.get_nearby_pharmacies(
                request.location.latitude, request.location.longitude
            )
            
        return StructuredReportResponse(
            patient_summary=summary,
            risk_level=request.risk_level,
            possible_conditions=analysis["predicted_conditions"],
            recommended_action=analysis["doctor_consultation_message"] or "Consult a professional",
            first_aid_steps=first_aid,
            emergency_instructions=action_plan.get("emergency_instructions", []),
            next_steps=action_plan.get("next_steps", []),
            nearby_hospitals=hospitals,
            nearby_pharmacies=pharmacies
        )
    except Exception as e:
        logger.error(f"Error generating structured report: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating structured report")
