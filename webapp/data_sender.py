import requests
import json
import numpy as np
from config import BACKEND_URL_METERS, RETRAIN_THRESHOLD, logger
from database import get_recent_predictions
from models import predict_next_hours   





def send_to_backend(meter_id: str):
    """Send tick data to backend API."""
    async def dashboard(meter_id: str):
        """Get current dashboard state for a meter."""
        session = get_session(meter_id)

        if not session:
            logger.error(f"Session not found for meter_id: {meter_id}")
            return

        # Get prediction log
        pred_log = get_recent_predictions(meter_id, limit=100)

        # Get next 24h predictions
        predictions_24h = predict_next_hours(meter_id, session["sim_time"], 24)

        # Get next 168h (1 week) predictions
        predictions_week = predict_next_hours(meter_id, session["sim_time"], 168)

        # Compute stats
        errors = [p["error"] for p in pred_log if p["error"] is not None]
        avg_error = round(np.mean(errors), 6) if errors else None
        mae = avg_error  # Mean Absolute Error
        resp = requests.post(BACKEND_URL_METERS, json={
            "meter_id": meter_id,
            "sim_time": session["sim_time"],
            "tick_count": session["tick_count"],
            "last_true_kwh": session["last_true_kwh"],
            "last_predicted_kwh": session["last_predicted_kwh"],
            "last_error": session["last_error"],
            "model_version": session["model_version"],
            "new_data_since_retrain": session["new_data_since_retrain"],
            "retrain_threshold": RETRAIN_THRESHOLD,
            "status": session["status"],
            "mae": mae,
            "prediction_log": pred_log,
            "predictions_24h": predictions_24h,
            "predictions_week": predictions_week, 
        })
        if resp.status_code != 200:
            logger.error(f"Failed to send data to backend: {resp.text}")      