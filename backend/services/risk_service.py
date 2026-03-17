import joblib
import numpy as np
import logging
import os
from typing import List, Optional

logger = logging.getLogger(__name__)

class RiskEngine:
    def __init__(self):
        self.model = None
        self.features = None
        self.model_path = "backend/ai_models/risk_model.joblib"
        self.cols_path = "backend/ai_models/model_columns.joblib"
        
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.cols_path):
                self.model = joblib.load(self.model_path)
                self.features = joblib.load(self.cols_path)
                logger.info("RiskEngine: ML Model loaded successfully.")
            else:
                logger.warning("RiskEngine: ML Model files not found. Using fallback logic.")
        except Exception as e:
            logger.error(f"RiskEngine: Failed to load ML model: {e}")

    async def predict_risk(self, age: int, symptoms: List[str], history: List[str]):
        if not self.model:
            return self._fallback_risk(symptoms)

        # 1. Vectorize input
        # Features: [age, symp1...sympN, hist1...histN]
        # We need to map symptoms and history to the exact index from model_columns
        input_vector = [0] * len(self.features)
        input_vector[0] = age
        
        # Mapping helpers
        for s in symptoms:
            if s.lower() in self.features:
                idx = self.features.index(s.lower())
                input_vector[idx] = 1
        
        for h in history:
            if h.lower() in self.features:
                idx = self.features.index(h.lower())
                input_vector[idx] = 1

        # 2. Predict
        try:
            X = np.array([input_vector])
            prediction = self.model.predict(X)[0]
            probabilities = self.model.predict_proba(X)[0]
            confidence = float(np.max(probabilities))
            
            risk_map = {0: "Low", 1: "Moderate", 2: "High", 3: "Critical"}
            risk_level = risk_map.get(prediction, "Unknown")
            
            actions = {
                "Low": "Monitor symptoms and rest. Consult a pharmacist if needed.",
                "Moderate": "Schedule a non-emergency doctor visit. Keep a log of symptoms.",
                "High": "Consult a doctor immediately or visit an urgent care center.",
                "Critical": "CALL EMERGENCY SERVICES (911) IMMEDIATELY. Do not drive yourself."
            }
            
            return {
                "risk_level": risk_level,
                "confidence_score": round(confidence, 2),
                "recommended_action": actions.get(risk_level, "Consult a medical professional.")
            }
        except Exception as e:
            logger.error(f"RiskEngine: Prediction error: {e}")
            return self._fallback_risk(symptoms)

    def _fallback_risk(self, symptoms: List[str]):
        # Simple rule-based fallback
        risk = "Low"
        if any(s in ["chest pain", "shortness of breath"] for s in symptoms):
            risk = "Critical"
        return {
            "risk_level": risk,
            "confidence_score": 0.5,
            "recommended_action": "Rule-based assessment: Please see a doctor."
        }
