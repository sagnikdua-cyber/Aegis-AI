import google.generativeai as genai
from typing import List
import logging
from config.settings import GEMINI_API_KEY

# Setup logging
logger = logging.getLogger(__name__)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class FirstAidService:
    def __init__(self):
        if GEMINI_API_KEY:
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None

    async def get_instructions(self, symptoms: str) -> List[str]:
        if not self.model:
            return ["API Key not configured. Unable to generate AI instructions."]

        prompt = f"""
        Symptoms: "{symptoms}"
        
        Instructions:
        Provide a concise, numbered list of first aid instructions for the symptoms mentioned above.
        Each item should be a single clear action.
        Include a "WARNING" or "IMPORTANT" step if relevant (e.g., calling emergency services for heart attack).
        Keep it to 4-6 bullet points.
        
        Return the list format only, one item per line, no summary or intro.
        """

        try:
            response = self.model.generate_content(prompt)
            lines = response.text.strip().split('\n')
            return [line.strip() for line in lines if line.strip()]

        except Exception as e:
            logger.error(f"FirstAidService AI Error: {e}")
            return [
                "1. Stay calm and ensure the area is safe.",
                "2. Monitor the person's breathing.",
                "3. If symptoms worsen, call emergency services immediately."
            ]
