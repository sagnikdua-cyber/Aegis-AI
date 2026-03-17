import google.generativeai as genai
from typing import List, Optional, Dict
import json
import logging
import traceback
from datetime import datetime
from config.settings import GEMINI_API_KEY
from models.schemas import UserProfile, MedicineRecommendation

# Setup logging
logger = logging.getLogger(__name__)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class SymptomAnalyzer:
    def __init__(self):
        self.model_name = 'gemini-2.5-flash'
        self.model_matched = False
        
        # Verify model matching
        try:
            models_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models.json")
            if os.path.exists(models_path):
                with open(models_path, 'r') as f:
                    valid_models = json.load(f)
                    # Check for exact match or general version
                    if f"models/{self.model_name}" in valid_models or any(self.model_name in m for m in valid_models):
                        self.model_matched = True
                        logger.info(f"SymptomAnalyzer: Model {self.model_name} matched successfully.")
                    else:
                        logger.warning(f"SymptomAnalyzer: Model {self.model_name} NOT found in models.json!")
            else:
                logger.warning("SymptomAnalyzer: models.json not found. Skipping validation.")
        except Exception as e:
            logger.error(f"SymptomAnalyzer: Error during model validation: {e}")

        if GEMINI_API_KEY:
            self.model = genai.GenerativeModel(self.model_name)
        else:
            self.model = None
        logger.info("SymptomAnalyzer: Gemini model initialized.")

    async def analyze(self, symptoms_text: str, profile: Optional[UserProfile] = None):
        logger.info(f"AI Analysis processing: {symptoms_text}")
        
        if not self.model:
            return {
                "extracted_symptoms": [],
                "predicted_conditions": ["AI Service Unavailable"],
                "risk_level": "Unknown",
                "recommendations": [],
                "doctor_consultation_message": "API Key not configured. Please consult a doctor.",
                "emergency_instructions": [],
                "next_steps": ["Check internet connection", "Configure API key"]
            }

        history_context = ""
        if profile:
            history_context = f"\nPatient Profile: Age {profile.age}, Allergies: {', '.join(profile.allergies)}, Chronic Diseases: {', '.join(profile.chronic_diseases)}"

        prompt = f"""
        Act as a professional medical triage assistant. Analyze the following patient data.
        {history_context}
        Symptoms: "{symptoms_text}"
        
        Provide a structured JSON response with the following fields:
        1. "extracted_symptoms": List of clinical symptoms found in the text.
        2. "predicted_conditions": List of 2-3 likely medical conditions.
        3. "risk_level": One of [Low, Moderate, High, Critical]. 
           - High/Critical: Chest pain, severe difficulty breathing, heavy bleeding, stroke signs, severe trauma.
           - Moderate: Persistent fever, minor respiratory issues, moderate pain.
           - Low: Common cold, mild headache, simple indigestion.
        4. "recommendations": List of objects representing over-the-counter medicine suggestions ONLY for 'Low' or 'Moderate' risk levels. 
           Each object has: "medicine_name", "dosage_suggestion", and "warning_message".
           For 'High' or 'Critical' risk, this list must be empty.
        5. "doctor_consultation_message": 
           - For 'High' or 'Critical': Urgent instruction to see a doctor or call emergency services.
           - For 'Moderate': Advice to consult a doctor if symptoms persist.
           - For 'Low': Advice on rest and monitoring.
        6. "emergency_instructions": A list of 3-5 specific, actionable steps to take RIGHT NOW. 
           - If High/Critical, focus on immediate life-saving actions or prep for paramedics.
           - If Low/Moderate, focus on immediate comfort or safety.
        7. "next_steps": A list of 2-3 steps for the next few hours/days (e.g., "Monitor temperature every 4 hours", "Book appointment with GP").

        Return ONLY valid JSON. No markdown or summary text.
        """

        try:
            response = self.model.generate_content(prompt)
            
            # Check for candidates and safety blockers
            if not response.candidates:
                logger.error("SymptomAnalyzer: No candidates returned from AI.")
                raw_text = "{}"
            else:
                raw_text = response.text.strip()
            
            logger.info(f"SymptomAnalyzer: Raw AI Response: {raw_text}")
            
            # DEBUG: Write to file
            with open("error_debug.txt", "a") as df:
                df.write(f"\n--- {datetime.now()} ---\nRAW: {raw_text}\n")

            # Clean up markdown code blocks if present
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:-3].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text[3:-3].strip()
                
            data = json.loads(raw_text)
            
            # Ensure recommendations are properly formatted as MedicineRecommendation objects
            recommendations_data = []
            if data.get("recommendations"):
                for r in data["recommendations"]:
                    try:
                        recommendations_data.append(MedicineRecommendation(**r))
                    except Exception as re:
                        logger.warning(f"SymptomAnalyzer: Invalid recommendation item: {r}. Error: {re}")
            
            return {
                "extracted_symptoms": data.get("extracted_symptoms", []),
                "predicted_conditions": data.get("predicted_conditions", []),
                "risk_level": data.get("risk_level", "Unknown"),
                "recommendations": recommendations_data,
                "doctor_consultation_message": data.get("doctor_consultation_message", "Consult a professional."),
                "emergency_instructions": data.get("emergency_instructions", []),
                "next_steps": data.get("next_steps", [])
            }

        except Exception as e:
            logger.error(f"SymptomAnalyzer AI Error: {str(e)}", exc_info=True)
            with open("error_debug.txt", "a") as df:
                df.write(f"\n--- {datetime.now()} ---\nERROR: {str(e)}\n{traceback.format_exc()}\n")
            return {
                "extracted_symptoms": [],
                "predicted_conditions": ["Error in AI assessment"],
                "risk_level": "Unknown",
                "recommendations": [],
                "doctor_consultation_message": "An error occurred during AI analysis. Please consult a doctor immediately if symptoms are severe.",
                "emergency_instructions": [],
                "next_steps": []
            }
