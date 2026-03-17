import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Define symptoms and medical conditions
SYMPTOMS = ["chest pain", "shortness of breath", "sweating", "fever", "cough", "headache", "dizziness", "nausea"]
HISTORY = ["heart disease", "diabetes", "asthma", "hypertension"]

def generate_data(n_samples=1000):
    X = []
    y = []
    
    for _ in range(n_samples):
        age = np.random.randint(1, 95)
        n_symp = np.random.randint(1, 4)
        symps = np.random.choice(SYMPTOMS, n_symp, replace=False)
        n_hist = np.random.randint(0, 3)
        hists = np.random.choice(HISTORY, n_hist, replace=False)
        
        risk_score = 0
        if "chest pain" in symps or "shortness of breath" in symps:
            risk_score += 3
        if "heart disease" in hists and risk_score >= 3:
            risk_score += 1
        if age > 70 or age < 5:
            risk_score += 1
        if "fever" in symps and "cough" in symps:
            risk_score += 1

        if risk_score >= 4:
            y.append(3) # Critical
        elif risk_score == 3:
            y.append(2) # High
        elif risk_score == 2:
            y.append(1) # Moderate
        else:
            y.append(0) # Low
            
        # Feature vector: [age, symp1, symp2..., hist1, hist2...]
        features = [age]
        for s in SYMPTOMS:
            features.append(1 if s in symps else 0)
        for h in HISTORY:
            features.append(1 if h in hists else 0)
        X.append(features)
    
    return np.array(X), np.array(y)

def train_and_save():
    X, y = generate_data()
    
    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X, y)
    
    os.makedirs("backend/ai_models", exist_ok=True)
    
    joblib.dump(model, "backend/ai_models/risk_model.joblib")
    features_list = ["age"] + SYMPTOMS + HISTORY
    joblib.dump(features_list, "backend/ai_models/model_columns.joblib")
    print("Model trained successfully.")

if __name__ == "__main__":
    train_and_save()
