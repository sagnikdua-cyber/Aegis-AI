from pydantic import BaseModel, Field
from typing import List, Optional

# User Profile Schema
class UserProfile(BaseModel):
    name: str
    age: int
    allergies: List[str] = []
    chronic_diseases: List[str] = []
    medications: List[str] = []
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

# Symptom Analysis
class SymptomAnalysisRequest(BaseModel):
    symptoms_text: str
    user_profile: Optional[UserProfile] = None

class MedicineRecommendation(BaseModel):
    medicine_name: str
    dosage_suggestion: str
    warning_message: str

class SymptomAnalysisResponse(BaseModel):
    extracted_symptoms: List[str]
    predicted_conditions: List[str]
    risk_level: str
    recommendations: Optional[List[MedicineRecommendation]] = None
    doctor_consultation_message: Optional[str] = None
    emergency_instructions: Optional[List[str]] = []
    next_steps: Optional[List[str]] = []

class RiskAssessmentResponse(BaseModel):
    risk_level: str
    confidence_score: float
    recommended_action: str

# Injury Detection
class InjuryDetectionResponse(BaseModel):
    injury_type: str
    severity: str
    recommended_actions: List[str]

# Location Based Services
class LocationRequest(BaseModel):
    latitude: float
    longitude: float

class HospitalInfo(BaseModel):
    name: str
    distance: str
    lat: float
    lng: float
    address: Optional[str] = None
    map_link: Optional[str] = None

class PharmacyInfo(BaseModel):
    name: str
    distance: str
    lat: float
    lng: float
    address: Optional[str] = None
    map_link: Optional[str] = None

# First Aid
class FirstAidRequest(BaseModel):
    symptoms: str

class FirstAidResponse(BaseModel):
    instructions: List[str]

# Medical Summary
class MedicalSummaryRequest(BaseModel):
    symptoms: str
    predicted_condition: str
    risk_level: str
    recommended_action: str

class MedicalSummaryResponse(BaseModel):
    summary: str

# SOS Alert
class AlertRequest(BaseModel):
    location: str
    risk_level: str
    contact_phone: Optional[str] = None
    symptoms: Optional[List[str]] = []

class APIResponse(BaseModel):
    status: str
    message: str

class ConfigTestResponse(BaseModel):
    gemini_api_loaded: bool
    mongodb_uri_loaded: bool

class StructuredReportRequest(BaseModel):
    symptoms: str
    risk_level: str
    detected_injuries: Optional[str] = "None"
    medicines_suggested: Optional[List[str]] = []
    location: Optional[LocationRequest] = None

class StructuredReportResponse(BaseModel):
    patient_summary: str
    risk_level: str
    possible_conditions: List[str]
    recommended_action: str
    first_aid_steps: List[str]
    emergency_instructions: List[str] = []
    next_steps: List[str] = []
    nearby_hospitals: List[HospitalInfo]
    nearby_pharmacies: List[PharmacyInfo]
