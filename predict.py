import sys
import json
import joblib
import pandas as pd
import os

def predict(input_data):
    model_path = "demand_model.joblib"
    if not os.path.exists(model_path):
        return {"error": f"Model file '{model_path}' not found. Please train the model first."}

    pipeline = joblib.load(model_path)

    # Standard input mapping with fallbacks
    sample = {
        'Equipment_Type': [input_data.get('Equipment_Type', 'Bulldozer')],
        'Site': [input_data.get('Site', 'Nagpur Mine')],
        'Month': [input_data.get('Month', 'January')],
        'Day_of_Week': [input_data.get('Day_of_Week', 'Friday')],
        'Weather': [input_data.get('Weather', 'Cloudy')],
        'Rental_Days': [float(input_data.get('Rental_Days', 10))],
        'Engine_Hours': [float(input_data.get('Engine_Hours', 100))],
        'Idle_Hours': [float(input_data.get('Idle_Hours', 15))],
        'Current_Rentals': [float(input_data.get('Current_Rentals', 50))],
        'Available_Equipment': [float(input_data.get('Available_Equipment', 20))],
        'Previous_Demand': [float(input_data.get('Previous_Demand', 60))]
    }

    df_sample = pd.DataFrame(sample)
    prediction = pipeline.predict(df_sample)[0]

    return {
        "predicted_demand": round(float(prediction), 2),
        "inputs": input_data
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            raw_input = sys.argv[1]
            input_json = json.loads(raw_input)
            result = predict(input_json)
            print(json.dumps(result))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
    else:
        # Default test
        print(json.dumps(predict({})))
