import pandas as pd
import numpy as np
import joblib
import json
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def train_and_save():
    csv_path = "CAT_Demand_Forecasting_Dataset_20000.csv"
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset file '{csv_path}' not found!")

    print(f"Loading dataset from {csv_path}...")
    df = pd.read_csv(csv_path)

    # Features and Target
    categorical_cols = ['Equipment_Type', 'Site', 'Month', 'Day_of_Week', 'Weather']
    numeric_cols = ['Rental_Days', 'Engine_Hours', 'Idle_Hours', 'Current_Rentals', 'Available_Equipment', 'Previous_Demand']
    target_col = 'Predicted_Demand'

    X = df[categorical_cols + numeric_cols]
    y = df[target_col]

    # Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols),
            ('num', StandardScaler(), numeric_cols)
        ]
    )

    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1))
    ])

    # Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Demand Forecasting Model...")
    pipeline.fit(X_train, y_train)

    # Evaluation
    y_pred = pipeline.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print(f"R² Score: {r2:.4f} | MAE: {mae:.2f} | RMSE: {rmse:.2f}")

    # Save Demand Model
    joblib.dump(pipeline, "demand_model.joblib")

    # --- Train IsolationForest Anomaly Detector for Asset Misuse ---
    print("Training IsolationForest Anomaly Detection Model for Asset Misuse...")
    anomaly_features = df[['Idle_Hours', 'Engine_Hours', 'Rental_Days', 'Current_Rentals', 'Available_Equipment']]
    iso_forest = IsolationForest(n_estimators=100, contamination=0.035, random_state=42, n_jobs=-1)
    iso_forest.fit(anomaly_features)
    
    # Save Anomaly Detector
    joblib.dump(iso_forest, "anomaly_model.joblib")

    # Compute Anomaly Predictions on Dataset
    scores = iso_forest.decision_function(anomaly_features)
    predictions = iso_forest.predict(anomaly_features) # -1 = Anomaly, 1 = Normal

    df['anomaly_score'] = scores
    df['is_anomaly'] = predictions == -1

    anomaly_records = df[df['is_anomaly']].copy()

    def categorize_misuse(row):
        reasons = []
        if row['Idle_Hours'] >= 30:
            reasons.append('EXCESSIVE_IDLE_HOURS')
        if row['Engine_Hours'] >= 240 and row['Rental_Days'] <= 12:
            reasons.append('OFF_SHIFT_OVERUSE')
        if row['Available_Equipment'] >= 35 and row['Current_Rentals'] <= 25:
            reasons.append('UNASSIGNED_DORMANT_STOCK')
        if not reasons:
            reasons.append('UNUSUAL_TELEMETRY_BURN')
        return ', '.join(reasons)

    anomaly_records['misuse_type'] = anomaly_records.apply(categorize_misuse, axis=1)

    flagged_list = []
    for idx, row in anomaly_records.head(50).iterrows():
        severity = 'CRITICAL' if row['Idle_Hours'] > 45 or 'OFF_SHIFT_OVERUSE' in row['misuse_type'] else 'WARNING'
        flagged_list.append({
            "record_id": int(row['Record_ID']),
            "equipment_id": str(row['Equipment_ID']),
            "equipment_type": str(row['Equipment_Type']),
            "site": str(row['Site']),
            "idle_hours": int(row['Idle_Hours']),
            "engine_hours": int(row['Engine_Hours']),
            "rental_days": int(row['Rental_Days']),
            "misuse_type": row['misuse_type'],
            "severity": severity,
            "anomaly_score": round(float(-row['anomaly_score']), 3)
        })

    month_order = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    df['Month_Cat'] = pd.Categorical(df['Month'], categories=month_order, ordered=True)

    # --- Anomaly Stock Market Financial Time-Series Aggregations ---
    anomaly_stock_chart_data = []
    close_idles = []
    for m_name, group in df.groupby('Month_Cat', observed=False):
        if len(group) == 0:
            continue
        idles = group['Idle_Hours']
        high_i = float(idles.max())
        low_i = float(idles.min())
        open_i = float(idles.iloc[0])
        close_i = round(float(idles.mean()), 1)
        vol_i = int(group['Idle_Hours'].sum())
        close_idles.append(close_i)
        sma = round(sum(close_idles[-3:]) / len(close_idles[-3:]), 1)

        anomaly_stock_chart_data.append({
            "period": m_name[:3],
            "month": m_name,
            "open": round(open_i, 1),
            "high": round(high_i, 1),
            "low": round(low_i, 1),
            "close": close_i,
            "volume": vol_i,
            "sma_3": sma,
            "trend": "BULLISH" if close_i >= open_i else "BEARISH"
        })

    # Equipment-specific Anomaly Stock Chart Data
    anomaly_equipment_stock_data = {}
    for eq_type, eq_group in df.groupby('Equipment_Type'):
        eq_group['Month_Cat'] = pd.Categorical(eq_group['Month'], categories=month_order, ordered=True)
        eq_monthly = []
        eq_closes = []
        for m_name, group in eq_group.groupby('Month_Cat', observed=False):
            if len(group) == 0:
                continue
            idles = group['Idle_Hours']
            high_i = float(idles.max())
            low_i = float(idles.min())
            open_i = float(idles.iloc[0])
            close_i = round(float(idles.mean()), 1)
            vol_i = int(group['Idle_Hours'].sum())
            eq_closes.append(close_i)
            sma = round(sum(eq_closes[-3:]) / len(eq_closes[-3:]), 1)
            eq_monthly.append({
                "period": m_name[:3],
                "month": m_name,
                "open": round(open_i, 1),
                "high": round(high_i, 1),
                "low": round(low_i, 1),
                "close": close_i,
                "volume": vol_i,
                "sma_3": sma,
                "trend": "BULLISH" if close_i >= open_i else "BEARISH"
            })
        anomaly_equipment_stock_data[eq_type] = eq_monthly

    # Site-specific Anomaly Stock Chart Data
    anomaly_site_stock_data = {}
    for s_name, s_group in df.groupby('Site'):
        s_group['Month_Cat'] = pd.Categorical(s_group['Month'], categories=month_order, ordered=True)
        site_monthly = []
        site_closes = []
        for m_name, group in s_group.groupby('Month_Cat', observed=False):
            if len(group) == 0:
                continue
            idles = group['Idle_Hours']
            high_i = float(idles.max())
            low_i = float(idles.min())
            open_i = float(idles.iloc[0])
            close_i = round(float(idles.mean()), 1)
            vol_i = int(group['Idle_Hours'].sum())
            site_closes.append(close_i)
            sma = round(sum(site_closes[-3:]) / len(site_closes[-3:]), 1)
            site_monthly.append({
                "period": m_name[:3],
                "month": m_name,
                "open": round(open_i, 1),
                "high": round(high_i, 1),
                "low": round(low_i, 1),
                "close": close_i,
                "volume": vol_i,
                "sma_3": sma,
                "trend": "BULLISH" if close_i >= open_i else "BEARISH"
            })
        anomaly_site_stock_data[s_name] = site_monthly

    # Site + Equipment Combination Anomaly Stock Chart Data
    anomaly_site_equipment_stock_data = {}
    for (s_name, eq_name), se_group in df.groupby(['Site', 'Equipment_Type']):
        se_group['Month_Cat'] = pd.Categorical(se_group['Month'], categories=month_order, ordered=True)
        se_monthly = []
        se_closes = []
        for m_name, group in se_group.groupby('Month_Cat', observed=False):
            if len(group) == 0:
                continue
            idles = group['Idle_Hours']
            high_i = float(idles.max())
            low_i = float(idles.min())
            open_i = float(idles.iloc[0])
            close_i = round(float(idles.mean()), 1)
            vol_i = int(group['Idle_Hours'].sum())
            se_closes.append(close_i)
            sma = round(sum(se_closes[-3:]) / len(se_closes[-3:]), 1)
            se_monthly.append({
                "period": m_name[:3],
                "month": m_name,
                "open": round(open_i, 1),
                "high": round(high_i, 1),
                "low": round(low_i, 1),
                "close": close_i,
                "volume": vol_i,
                "sma_3": sma,
                "trend": "BULLISH" if close_i >= open_i else "BEARISH"
            })
        anomaly_site_equipment_stock_data[f"{s_name}_{eq_name}"] = se_monthly

    anomaly_summary = {
        "total_anomalies_detected": int(len(anomaly_records)),
        "misuse_rate_pct": round(float(len(anomaly_records) / len(df) * 100), 2),
        "idle_hour_flags": int((anomaly_records['misuse_type'].str.contains('EXCESSIVE_IDLE_HOURS')).sum()),
        "overuse_flags": int((anomaly_records['misuse_type'].str.contains('OFF_SHIFT_OVERUSE')).sum()),
        "dormant_stock_flags": int((anomaly_records['misuse_type'].str.contains('UNASSIGNED_DORMANT_STOCK')).sum()),
        "flagged_assets": flagged_list,
        "stock_chart_data": anomaly_stock_chart_data,
        "equipment_stock_data": anomaly_equipment_stock_data,
        "site_stock_data": anomaly_site_stock_data,
        "site_equipment_stock_data": anomaly_site_equipment_stock_data
    }

    print(f"Anomaly Detection complete: {len(anomaly_records)} misuse anomalies detected ({anomaly_summary['misuse_rate_pct']}% of fleet).")


    # Generate Stock Market Financial Time-Series Aggregations
    stock_chart_data = []
    
    # Global monthly aggregation
    monthly_groups = df.groupby('Month_Cat', observed=False)
    close_prices = []
    
    for idx, (m_name, group) in enumerate(monthly_groups):
        if len(group) == 0:
            continue
        p_demand = group['Predicted_Demand']
        high_d = float(p_demand.max())
        low_d = float(p_demand.min())
        open_d = float(p_demand.iloc[0])
        close_d = float(p_demand.mean())
        volume_hrs = int(group['Engine_Hours'].sum())
        close_prices.append(close_d)

        # 3-period SMA
        sma_3 = round(sum(close_prices[-3:]) / len(close_prices[-3:]), 1)

        stock_chart_data.append({
            "period": m_name[:3], # Jan, Feb, Mar...
            "month": m_name,
            "open": round(open_d, 1),
            "high": round(high_d, 1),
            "low": round(low_d, 1),
            "close": round(close_d, 1),
            "volume": volume_hrs,
            "sma_3": sma_3,
            "upper_band": round(close_d * 1.12, 1),
            "lower_band": round(close_d * 0.88, 1),
            "trend": "BULLISH" if close_d >= open_d else "BEARISH"
        })

    # Equipment-specific Stock Chart Data
    equipment_stock_data = {}
    for eq_type, eq_group in df.groupby('Equipment_Type'):
        eq_group['Month_Cat'] = pd.Categorical(eq_group['Month'], categories=month_order, ordered=True)
        eq_monthly = []
        eq_closes = []
        for m_name, group in eq_group.groupby('Month_Cat', observed=False):
            if len(group) == 0:
                continue
            p_demand = group['Predicted_Demand']
            high_d = float(p_demand.max())
            low_d = float(p_demand.min())
            open_d = float(p_demand.iloc[0])
            close_d = float(p_demand.mean())
            volume_hrs = int(group['Engine_Hours'].sum())
            eq_closes.append(close_d)
            sma = round(sum(eq_closes[-3:]) / len(eq_closes[-3:]), 1)

            eq_monthly.append({
                "period": m_name[:3],
                "month": m_name,
                "open": round(open_d, 1),
                "high": round(high_d, 1),
                "low": round(low_d, 1),
                "close": round(close_d, 1),
                "volume": volume_hrs,
                "sma_3": sma,
                "upper_band": round(close_d * 1.12, 1),
                "lower_band": round(close_d * 0.88, 1),
                "trend": "BULLISH" if close_d >= open_d else "BEARISH"
            })
        equipment_stock_data[eq_type] = eq_monthly

    # Standard Group Summaries
    equipment_summary = df.groupby('Equipment_Type').agg(
        total_demand=('Predicted_Demand', 'sum'),
        avg_demand=('Predicted_Demand', 'mean'),
        current_rentals=('Current_Rentals', 'sum'),
        available_equipment=('Available_Equipment', 'sum')
    ).reset_index().to_dict(orient='records')

    site_summary = df.groupby('Site').agg(
        total_demand=('Predicted_Demand', 'sum'),
        avg_demand=('Predicted_Demand', 'mean'),
        current_rentals=('Current_Rentals', 'sum'),
        available_equipment=('Available_Equipment', 'sum')
    ).reset_index().to_dict(orient='records')

    # Generate Intra-City Rebalancing Logistics Matrix (Indian Rupees - INR)
    sites = sorted(df['Site'].unique().tolist())
    rebalancing_matrix = [
        {
          "id": "REBAL-01",
          "city": "Mumbai",
          "from_site": "Mumbai Port Depot Yard",
          "to_site": "Mumbai Coastal Road Project B",
          "equipment_type": "Excavator",
          "qty": 4,
          "distance_km": 18,
          "est_cost_inr": 16000,
          "est_revenue_gain_inr": 420000,
          "net_roi_inr": 404000,
          "priority": "HIGH"
        },
        {
          "id": "REBAL-02",
          "city": "Delhi NCR",
          "from_site": "Delhi Aerocity Equipment Yard",
          "to_site": "Delhi NCR Metro Extension",
          "equipment_type": "Bulldozer",
          "qty": 3,
          "distance_km": 24,
          "est_cost_inr": 22000,
          "est_revenue_gain_inr": 510000,
          "net_roi_inr": 488000,
          "priority": "HIGH"
        },
        {
          "id": "REBAL-03",
          "city": "Nagpur",
          "from_site": "Nagpur MIDC Logistics Hub",
          "to_site": "Nagpur Ring Road Expressway",
          "equipment_type": "Crane",
          "qty": 2,
          "distance_km": 15,
          "est_cost_inr": 18000,
          "est_revenue_gain_inr": 360000,
          "net_roi_inr": 342000,
          "priority": "MEDIUM"
        },
        {
          "id": "REBAL-04",
          "city": "Bengaluru",
          "from_site": "Bengaluru Electronic City Depot",
          "to_site": "Bengaluru Peripheral Ring Road",
          "equipment_type": "Wheel Loader",
          "qty": 3,
          "distance_km": 28,
          "est_cost_inr": 20000,
          "est_revenue_gain_inr": 390000,
          "net_roi_inr": 370000,
          "priority": "MEDIUM"
        }
    ]

    # Site-specific Stock Chart Data
    site_stock_data = {}
    for s_name, s_group in df.groupby('Site'):
        s_group['Month_Cat'] = pd.Categorical(s_group['Month'], categories=month_order, ordered=True)
        site_monthly = []
        site_closes = []
        for m_name, group in s_group.groupby('Month_Cat', observed=False):
            if len(group) == 0:
                continue
            p_demand = group['Predicted_Demand']
            high_d = float(p_demand.max())
            low_d = float(p_demand.min())
            open_d = float(p_demand.iloc[0])
            close_d = float(p_demand.mean())
            volume_hrs = int(group['Engine_Hours'].sum())
            site_closes.append(close_d)
            sma = round(sum(site_closes[-3:]) / len(site_closes[-3:]), 1)

            site_monthly.append({
                "period": m_name[:3],
                "month": m_name,
                "open": round(open_d, 1),
                "high": round(high_d, 1),
                "low": round(low_d, 1),
                "close": round(close_d, 1),
                "volume": volume_hrs,
                "sma_3": sma,
                "upper_band": round(close_d * 1.12, 1),
                "lower_band": round(close_d * 0.88, 1),
                "trend": "BULLISH" if close_d >= open_d else "BEARISH"
            })
        site_stock_data[s_name] = site_monthly

    # Site + Equipment Combination Stock Chart Data
    site_equipment_stock_data = {}
    for (s_name, eq_name), se_group in df.groupby(['Site', 'Equipment_Type']):
        se_group['Month_Cat'] = pd.Categorical(se_group['Month'], categories=month_order, ordered=True)
        se_monthly = []
        se_closes = []
        for m_name, group in se_group.groupby('Month_Cat', observed=False):
            if len(group) == 0:
                continue
            p_demand = group['Predicted_Demand']
            high_d = float(p_demand.max())
            low_d = float(p_demand.min())
            open_d = float(p_demand.iloc[0])
            close_d = float(p_demand.mean())
            volume_hrs = int(group['Engine_Hours'].sum())
            se_closes.append(close_d)
            sma = round(sum(se_closes[-3:]) / len(se_closes[-3:]), 1)

            se_monthly.append({
                "period": m_name[:3],
                "month": m_name,
                "open": round(open_d, 1),
                "high": round(high_d, 1),
                "low": round(low_d, 1),
                "close": round(close_d, 1),
                "volume": volume_hrs,
                "sma_3": sma,
                "upper_band": round(close_d * 1.12, 1),
                "lower_band": round(close_d * 0.88, 1),
                "trend": "BULLISH" if close_d >= open_d else "BEARISH"
            })
        key = f"{s_name}_{eq_name}"
        site_equipment_stock_data[key] = se_monthly

    forecast_json_path = os.path.join("cat-smart-rental-api", "forecast_summary.json")
    summary_data = {
        "model_metrics": {
            "r2_score": round(float(r2), 4),
            "mae": round(float(mae), 2),
            "rmse": round(float(rmse), 2),
            "total_records_trained": int(len(df))
        },
        "unique_options": {
            "sites": sites,
            "equipment_types": sorted(df['Equipment_Type'].unique().tolist()),
            "months": month_order,
            "weather": sorted(df['Weather'].unique().tolist())
        },
        "stock_chart_data": stock_chart_data,
        "equipment_stock_data": equipment_stock_data,
        "site_stock_data": site_stock_data,
        "site_equipment_stock_data": site_equipment_stock_data,
        "by_equipment": equipment_summary,
        "by_site": site_summary,
        "rebalancing_matrix": rebalancing_matrix,
        "anomaly_summary": anomaly_summary
    }

    with open(forecast_json_path, 'w') as f:
        json.dump(summary_data, f, indent=2)



    
    print("Stock market demand forecast data generation complete.")

if __name__ == "__main__":
    train_and_save()
