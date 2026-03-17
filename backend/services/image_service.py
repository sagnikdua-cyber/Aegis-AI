import google.generativeai as genai
from PIL import Image
import io
import logging
import json
from config.settings import GEMINI_API_KEY

logger = logging.getLogger(__name__)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class ImageService:
    def __init__(self):
        # Initialize Gemini Model
        if GEMINI_API_KEY:
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None
        logger.info("ImageService: Gemini Vision model loaded.")

    async def detect_injury(self, image_bytes: bytes):
        try:
            if not self.model:
                return {
                    "injury_type": "Unknown",
                    "severity": "Unknown",
                    "recommended_actions": ["API Key not configured. Unable to analyze image."]
                }

            # 1. Load Image
            image = Image.open(io.BytesIO(image_bytes))

            # 2. Inference
            prompt = """
            Analyze the provided image for any visible physical injuries, wounds, or medical conditions.
            Provide your response in JSON format with the following schema:
            {
                "injury_type": "string (e.g., Burn, Cut, Bruise, None)",
                "severity": "string (e.g., Low, Moderate, High, Critical)",
                "recommended_actions": ["string", "string"] (List of concise first aid steps)
            }
            Ensure the response is valid JSON and contains only the JSON. Do not include markdown formatting like ```json or ```.
            """
            response = self.model.generate_content([prompt, image])
            response_text = response.text.strip()
            
            # Clean up potential markdown formatting if model still returns it
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            result = json.loads(response_text)

            return {
                "injury_type": result.get("injury_type", "Unknown"),
                "severity": result.get("severity", "Unknown"),
                "recommended_actions": result.get("recommended_actions", ["Consult a doctor for an accurate assessment."])
            }

        except Exception as e:
            logger.error(f"ImageService Error: {e}")
            return {
                "injury_type": "Error",
                "severity": "Unknown",
                "recommended_actions": ["Error processing image. Please try again or consult a doctor."]
            }
