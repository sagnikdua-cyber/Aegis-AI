from typing import List, Optional, Dict
from models.schemas import MedicineRecommendation

# OTC Mapping for simple symptoms
OTC_MAP: Dict[str, Dict] = {
    "fever": {
        "medicine_name": "Paracetamol (Acetaminophen)",
        "dosage_suggestion": "500mg-1000mg every 4-6 hours (Max 4g/day)",
        "warning_message": "Avoid if you have liver problems or allergy to paracetamol."
    },
    "cough": {
        "medicine_name": "Cough Suppressant (Dextromethorphan)",
        "dosage_suggestion": "10-20mg every 4 hours or as per label",
        "warning_message": "May cause drowsiness. Avoid alcohol while taking."
    },
    "headache": {
        "medicine_name": "Ibuprofen",
        "dosage_suggestion": "200mg-400mg every 4-6 hours (with food)",
        "warning_message": "Avoid if you have stomach ulcers, kidney issues, or asthma."
    },
    "cold": {
        "medicine_name": "Antihistamine (Cetirizine)",
        "dosage_suggestion": "10mg once daily",
        "warning_message": "May cause mild drowsiness in some individuals."
    },
    "nausea": {
        "medicine_name": "Antacid or Ginger lozenges",
        "dosage_suggestion": "As directed on the package",
        "warning_message": "If nausea persists or is accompanied by severe pain, see a doctor."
    }
}

class RecommendationService:
    def get_recommendations(self, risk_level: str, symptoms: List[str]) -> Dict:
        # Check risk level
        # Normalize risk level strings (they might come as "Low", "Critical" or "Low Risk")
        normalized_risk = risk_level.lower()
        
        if "high" in normalized_risk or "critical" in normalized_risk:
            return {
                "recommendations": None,
                "doctor_consultation_message": "IMMEDIATE DOCTOR CONSULTATION RECOMMENDED. Do not take self-medication for severe symptoms."
            }
        
        # Low or Moderate Risk
        recommendations = []
        for symptom in symptoms:
            s_lower = symptom.lower()
            if s_lower in OTC_MAP:
                rec = OTC_MAP[s_lower]
                recommendations.append(MedicineRecommendation(**rec))
        
        return {
            "recommendations": recommendations if recommendations else None,
            "doctor_consultation_message": "Consult a pharmacist for over-the-counter options if symptoms persist." if not recommendations else None
        }
