export interface SymptomAnalysisRequest {
  symptoms_text: string;
  user_profile?: UserProfile;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  allergies: string[];
  chronic_diseases: string[];
  medications: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface MedicineRecommendation {
  medicine_name: string;
  dosage_suggestion: string;
  warning_message: string;
}

export interface SymptomAnalysisResponse {
  extracted_symptoms: string[];
  predicted_conditions: string[];
  risk_level: string;
  recommendations?: MedicineRecommendation[];
  doctor_consultation_message?: string;
}

export interface InjuryDetectionResponse {
  injury_type: string;
  severity: string;
  recommended_actions: string[];
}

export interface HospitalInfo {
  name: string;
  distance: string;
  lat: number;
  lng: number;
  address?: string;
  map_link?: string;
}

export interface PharmacyInfo {
  name: string;
  distance: string;
  lat: number;
  lng: number;
  address?: string;
  map_link?: string;
}
