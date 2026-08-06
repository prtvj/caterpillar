import sys
import json
import os
import joblib
import pandas as pd
import numpy as np

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input JSON provided"}))
        sys.exit(1)

    try:
        input_data = json.loads(sys.argv[1])
    except Exception as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
        sys.exit(1)

    model_path = os.path.join(os.path.dirname(__file__), "anomaly_model.joblib")
    if not os.path.exists(model_path):
        print(json.dumps({"error": f"Anomaly model file '{model_path}' not found!"}))
        sys.exit(1)

    try:
        iso_forest = joblib.load(model_path)
    except Exception as e:
        print(json.dumps({"error": f"Failed to load anomaly model: {str(e)}"}))
        sys.exit(1)

    idle = float(input_data.get('Idle_Hours', 10))
    engine = float(input_data.get('Engine_Hours', 120))
    rental_days = float(input_data.get('Rental_Days', 15))
    rentals = float(input_data.get('Current_Rentals', 50))
    avail = float(input_data.get('Available_Equipment', 30))

    df_input = pd.DataFrame([{
        'Idle_Hours': idle,
        'Engine_Hours': engine,
        'Rental_Days': rental_days,
        'Current_Rentals': rentals,
        'Available_Equipment': avail
    }])

    prediction = iso_forest.predict(df_input)[0] # -1 = Anomaly, 1 = Normal
    score = iso_forest.decision_function(df_input)[0]

    is_anomaly = bool(prediction == -1)

    reasons = []
    if idle >= 30:
        reasons.append('EXCESSIVE_IDLE_HOURS')
    if engine >= 240 and rental_days <= 12:
        reasons.append('OFF_SHIFT_OVERUSE')
    if avail >= 35 and rentals <= 25:
        reasons.append('UNASSIGNED_DORMANT_STOCK')
    
    if is_anomaly and not reasons:
        reasons.append('UNUSUAL_TELEMETRY_BURN')

    misuse_type = ', '.join(reasons) if is_anomaly else 'NORMAL'
    severity = 'CRITICAL' if is_anomaly and (idle > 45 or 'OFF_SHIFT_OVERUSE' in misuse_type) else ('WARNING' if is_anomaly else 'NORMAL')

    output = {
        "is_anomaly": is_anomaly,
        "severity": severity,
        "misuse_type": misuse_type,
        "anomaly_score": round(float(-score), 3),
        "inputs": input_data
    }

    print(json.dumps(output))

if __name__ == '__main__':
    main()
