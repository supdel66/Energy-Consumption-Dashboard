"""
Energy Consumption Prediction API
POST /predict { "timestamp": "<YYYY-MM-DD HH:MM:SS>" }
"""

import os
import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)

# ──────────────────────────────────────────────
# Single model store: loaded once at startup
# ──────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
_model = None
_model_info = {}


def _load_first_model():
    """Load model.pkl from the same directory."""
    global _model, _model_info
    fpath = os.path.join("model.pkl")
    with open(fpath, "rb") as f:
        info = pickle.load(f)
    _model = info["model"]
    _model_info = {
        "stats": info["stats"],
        "filename": "model.pkl",
    }
    print(f"Loaded model: model.pkl")

# ──────────────────────────────────────────────
# Feature helpers
# ──────────────────────────────────────────────
METER_COLUMNS = [
    "Active Import(kWh)",
    "Active Export(kWh)",
    "Reactive Import(kVArh)",
    "Reactive Export(kVArh)",
    "Apparent Import(kVAh)",
    "Apparent Export(kVAh)",
    "Active Power(kW)",
    "Hourly_Kwh",
]

FEATURE_ORDER = [
    "Active Import(kWh)", "Active Export(kWh)", "Reactive Import(kVArh)",
    "Reactive Export(kVArh)", "Apparent Import(kVAh)", "Apparent Export(kVAh)",
    "Active Power(kW)", "Hourly_Kwh",
    "Hour", "DayOfWeek", "Month", "DayOfMonth", "IsWeekend",
    "lag_1", "lag_2", "lag_3",
    "roll_mean_3", "roll_mean_6", "roll_mean_12",
    "Hour_x_IsWeekend", "Month_x_Hour",
    "Hour_sin", "Hour_cos", "Month_sin", "Month_cos",
]


def _extract_time_features(ts: pd.Timestamp) -> dict:
    feats = {
        "Hour":      ts.hour,
        "Month":     ts.month,
        "DayOfMonth":ts.day,
        "DayOfWeek": ts.dayofweek,
        "IsWeekend": 1 if ts.dayofweek in [5, 6] else 0,
    }
    feats["Hour_x_IsWeekend"] = feats["Hour"] * feats["IsWeekend"]
    feats["Month_x_Hour"]     = feats["Month"] * feats["Hour"]
    feats["Hour_sin"]  = np.sin(2 * np.pi * feats["Hour"]  / 24)
    feats["Hour_cos"]  = np.cos(2 * np.pi * feats["Hour"]  / 24)
    feats["Month_sin"] = np.sin(2 * np.pi * feats["Month"] / 12)
    feats["Month_cos"] = np.cos(2 * np.pi * feats["Month"] / 12)
    return feats


def _predict(timestamp: str, meter_id: str = None) -> dict:
    stats = _model_info["stats"]

    pred_time = pd.to_datetime(timestamp)
    last_time = pd.to_datetime(stats["last time"])
    hours_elapsed = (pred_time - last_time).total_seconds() / 3600

    dynamic = {}
    for col in METER_COLUMNS:
        a = stats[col]["last_value"]
        D = stats[col]["mean_diff"]
        dynamic[col] = a + hours_elapsed * D

    time_feats = _extract_time_features(pred_time)
    hourly = dynamic["Hourly_Kwh"]

    features_dict = {
        **{col: dynamic[col] for col in METER_COLUMNS},
        **time_feats,
        "lag_1": hourly, "lag_2": hourly, "lag_3": hourly,
        "roll_mean_3": hourly, "roll_mean_6": hourly, "roll_mean_12": hourly,
    }

    X_pred = pd.DataFrame([features_dict])[FEATURE_ORDER]
    prediction = float(_model.predict(X_pred)[0])
    
    # Add random bias if meter_id is provided
    if meter_id:
        bias = np.random.uniform(0.01, 0.1)
        prediction += bias

    return {
        "timestamp":                  str(pred_time),
        "hours_elapsed":              round(hours_elapsed, 4),
        "predicted_consumption_kwh":  round(prediction, 6),
        "dynamic_meter_values":       {k: round(v, 6) for k, v in dynamic.items()},
        "time_features":              {k: round(v, 6) if isinstance(v, float) else v
                                       for k, v in time_feats.items()},
    }


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    if not _model:
        return jsonify({"error": "No model loaded"}), 500

    body = request.get_json(force=True, silent=True)
    if not body or "timestamp" not in body:
        return jsonify({"error": "'timestamp' is required"}), 400

    try:
        meter_id = body.get("meter_id")
        result = _predict(body["timestamp"], meter_id)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

    return jsonify(result), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": _model is not None})


if __name__ == "__main__":
    print("Loading first model…")
    _load_first_model()
    app.run(host="0.0.0.0", port=5000, debug=False)
