import google.generativeai as genai
from datetime import datetime
import logging
from config.settings import GEMINI_API_KEY

# Setup logging
logger = logging.getLogger(__name__)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class SummaryService:
    def __init__(self):
        if GEMINI_API_KEY:
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None

    def generate_patient_summary(self, symptoms: str, risk_level: str, injuries: str) -> str:
        if not self.model:
            return f"Patient reported {symptoms}. System assessment indicates a {risk_level} risk level. Detected injuries: {injuries}."

        prompt = f"""
        Act as a medical triage professional. Generate a concise, professional 2-sentence summary of the patient's presentation.
        
        Symptoms: "{symptoms}"
        Risk Level: "{risk_level}"
        Detected Physical Injuries: "{injuries}"
        
        The summary should focus on the severity and primary indicators.
        Return ONLY the summary text.
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"SummaryService AI Error: {e}")
            return f"Patient reported {symptoms}. Assessment shows {risk_level} risk with {injuries} detected."

    async def generate_action_plan(self, symptoms: str, risk_level: str, injuries: str) -> dict:
        if not self.model:
            return {
                "emergency_instructions": ["Stay calm", "Call for help if needed"],
                "next_steps": ["Monitor symptoms", "Consult a doctor if worsening"]
            }

        prompt = f"""
        Act as an emergency medical dispatcher. Based on the following data, provide specific, actionable steps.
        
        Symptoms: "{symptoms}"
        Risk Level: "{risk_level}"
        Injuries: "{injuries}"
        
        Provide a JSON response with:
        1. "emergency_instructions": A list of 3-5 immediate actions (e.g., "Apply pressure to wound", "Loosen tight clothing"). 
           If risk is Critical/High, these must be life-saving/stabilizing steps.
        2. "next_steps": A list of 2-3 follow-up actions for the next few hours (e.g., "Keep the leg elevated", "Avoid solid food").

        Return ONLY valid JSON.
        """

        try:
            response = self.model.generate_content(prompt)
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:-3].strip()
            return json.loads(raw_text)
        except Exception as e:
            logger.error(f"SummaryService Action Plan Error: {e}")
            return {
                "emergency_instructions": ["Ensure patient safety", "Monitor vital signs"],
                "next_steps": ["Seek medical advice"]
            }
