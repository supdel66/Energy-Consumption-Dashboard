"""
Model management functions for loading, saving, training, and predicting.
Each user gets their own XGBRegressor model that diverges from base over time.
"""

import pickle
from datetime import timedelta

import numpy as np
import pandas as pd
from xgboost import XGBRegressor

from config import METER_COLUMNS, FEATURE_ORDER, TARGET_COL, logger
from database import get_model_path, load_user_data
from features import extract_time_features, build_features_from_df


def load_user_model(meter_id: str):
    """
    Load user's model.pkl.
    
    Args:
        meter_id: The meter ID for the user
        
    Returns:
        Tuple of (model, stats_dict)
    """
    model_path = get_model_path(meter_id)
    with open(model_path, "rb") as f:
        info = pickle.load(f)
    return info["model"], info.get("stats", {})


def save_user_model(meter_id: str, model, stats: dict):
    """
    Save user's updated model.
    
    Args:
        meter_id: The meter ID for the user
        model: The trained XGBRegressor model
        stats: Dictionary of model statistics
    """
    model_path = get_model_path(meter_id)
    with open(model_path, "wb") as f:
        pickle.dump({
            "model": model,
            "stats": stats,
            "meter_id": meter_id,
            "cons_id": "",
        }, f)


def predict_with_user_model(meter_id: str, timestamp: str) -> float:
    """
    Use user's model to predict consumption at a given timestamp.
    
    Args:
        meter_id: The meter ID for the user
        timestamp: The timestamp to predict for
        
    Returns:
        Predicted consumption in kWh
    """
    model, stats = load_user_model(meter_id)

    pred_time = pd.to_datetime(timestamp)
    last_time = pd.to_datetime(stats["last time"])
    hours_elapsed = (pred_time - last_time).total_seconds() / 3600

    # Build dynamic meter values (same logic as simulator)
    dynamic = {}
    for col in METER_COLUMNS:
        a = stats[col]["last_value"]
        D = stats[col]["mean_diff"]
        dynamic[col] = a + hours_elapsed * D

    time_feats = extract_time_features(pred_time)
    hourly = dynamic["Hourly_Kwh"]

    features_dict = {
        **{col: dynamic[col] for col in METER_COLUMNS},
        **time_feats,
        "lag_1": hourly, "lag_2": hourly, "lag_3": hourly,
        "roll_mean_3": hourly, "roll_mean_6": hourly, "roll_mean_12": hourly,
    }

    X = pd.DataFrame([features_dict])[FEATURE_ORDER]
    prediction = float(model.predict(X)[0])
    return round(prediction, 6)


def predict_next_hours(meter_id: str, start_time: str, hours: int = 24) -> list:
    """
    Predict consumption for next N hours.
    
    Args:
        meter_id: The meter ID for the user
        start_time: Starting timestamp for predictions
        hours: Number of hours to predict (default: 24)
        
    Returns:
        List of prediction dictionaries with timestamp and predicted_kwh
    """
    predictions = []
    ts = pd.to_datetime(start_time)
    for h in range(1, hours + 1):
        future_ts = ts + timedelta(hours=h)
        ts_str = future_ts.strftime("%Y-%m-%d %H:%M:%S")
        pred = predict_with_user_model(meter_id, ts_str)
        predictions.append({"timestamp": ts_str, "predicted_kwh": pred})
    return predictions


def retrain_user_model(meter_id: str) -> bool:
    """
    Retrain user's XGBRegressor on all accumulated data.
    
    Args:
        meter_id: The meter ID for the user
        
    Returns:
        True if retraining was successful, False otherwise
    """
    logger.info(f"Retraining model for {meter_id}...")

    df = load_user_data(meter_id)
    if len(df) < 20:
        logger.warning(f"Not enough data to retrain for {meter_id}: {len(df)} rows")
        return False

    # Build features
    df_feat = build_features_from_df(df)
    if len(df_feat) < 15:
        logger.warning(f"Not enough featured rows for {meter_id}: {len(df_feat)}")
        return False

    X = df_feat[FEATURE_ORDER]
    y = df_feat[TARGET_COL]

    # Train new XGBRegressor
    model = XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbosity=0,
    )
    model.fit(X, y)

    # Update stats from latest data
    last_row = df.iloc[-1]
    last_time = pd.to_datetime(last_row["Data Time"])

    stats = {"last time": str(last_time)}
    for col in METER_COLUMNS:
        col_data = df[col].astype(float)
        diffs = col_data.diff().dropna()
        stats[col] = {
            "last_value": float(col_data.iloc[-1]),
            "mean_diff": float(diffs.mean()) if len(diffs) > 0 else 0.0,
        }

    save_user_model(meter_id, model, stats)
    logger.info(f"Model retrained for {meter_id} with {len(df_feat)} rows")
    return True
