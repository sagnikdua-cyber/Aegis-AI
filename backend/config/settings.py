import os
import logging
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load .env file
load_dotenv()

# Environment Variables
# Developers must manually insert these keys into the .env file in the backend root.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/aegis_ai")

# Location Strategy (OpenStreetMap/Overpass)
USE_OVERPASS = True

# Validation & Warnings
if not GEMINI_API_KEY:
    logger.warning("WARNING: GEMINI_API_KEY is missing. Advanced AI features may be disabled.")

if not MONGODB_URI:
    logger.warning("WARNING: MONGODB_URI is not set. Database persistence will fail.")
else:
    logger.info("Configuration loaded successfully.")
