# Mapping of symptoms to potential conditions for hackathon purposes
# In a real-world app, this would be a much larger knowledge base or ML model

SYMPTOM_CONDITION_MAP = {
    "chest pain": ["Heart Attack Risk", "Anxiety Attack", "Acid Reflux"],
    "shortness of breath": ["Heart Attack Risk", "Asthma Attack", "Pneumonia"],
    "sweating": ["Heart Attack Risk", "Heat Stroke", "Low Blood Sugar"],
    "fever": ["Infection", "Flu", "Common Cold"],
    "cough": ["Common Cold", "Bronchitis", "COVID-19"],
    "headache": ["Migraine", "Stress", "Dehydration"],
    "dizziness": ["Low Blood Pressure", "Anemia", "Inner Ear Issue"],
    "nausea": ["Food Poisoning", "Stomach Flu", "Motion Sickness"],
}

def map_symptoms_to_conditions(symptoms: list) -> list:
    conditions = set()
    for symptom in symptoms:
        mapped = SYMPTOM_CONDITION_MAP.get(symptom.lower(), [])
        for condition in mapped:
            conditions.add(condition)
    return list(conditions) if conditions else ["Unknown Condition - Consult a Doctor"]
