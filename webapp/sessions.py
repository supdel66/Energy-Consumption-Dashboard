"""
Session management and background scheduler for hourly ticks.
Handles user sessions, simulator communication, and model retraining.
"""

import os
import shutil
import threading
from datetime import timedelta


import pandas as pd
import requests
from apscheduler.schedulers.background import BackgroundScheduler

from config import (
    BACKEND_URL_METERS, USER_DATA_DIR, BASE_MODEL_PATH, SIMULATOR_URL, BACKEND_URL_METERS,
    TICK_INTERVAL_SECONDS, RETRAIN_THRESHOLD, logger
)
from database import get_model_path, init_user_db, insert_consumption
from models import load_user_model, predict_with_user_model, retrain_user_model

import numpy as np
from database import get_recent_predictions
from models import predict_next_hours

# ──────────────────────────────────────────────
# Active sessions tracking
# ──────────────────────────────────────────────
# Track active users: { meter_id: { sim_time, tick_count, last_prediction, ... } }
active_sessions = {}
session_lock = threading.Lock()

# Global scheduler
scheduler = BackgroundScheduler()
scheduler_jobs = {}  # meter_id -> job_id


def setup_user(meter_id: str) -> dict:
    """
    Initialize a new user: create folder, copy model, seed DB.
    
    Args:
        meter_id: The meter ID for the user
        
    Returns:
        Session dictionary for the user
    """
    user_dir = os.path.join(USER_DATA_DIR, meter_id)
    os.makedirs(user_dir, exist_ok=True)

    model_path = get_model_path(meter_id)
    if not os.path.exists(model_path):
        shutil.copy2(BASE_MODEL_PATH, model_path)
        logger.info(f"Copied base model for {meter_id}")

    init_user_db(meter_id)

    # Load model to get stats
    _, stats = load_user_model(meter_id)
    last_time = pd.to_datetime(stats["last time"])
    sim_start = last_time + timedelta(hours=1)

    session = {
        "meter_id": meter_id,
        "sim_time": sim_start.strftime("%Y-%m-%d %H:%M:%S"),
        "tick_count": 0,
        "new_data_since_retrain": 0,
        "total_data_points": 0,
        "last_true_kwh": None,
        "last_predicted_kwh": None,
        "last_error": None,
        "model_version": 0,
        "status": "active",
    }

    with session_lock:
        active_sessions[meter_id] = session

    return session


def hourly_tick(meter_id: str):
    """
    Called every tick: fetch true from simulator, predict, store, maybe retrain.
    
    Args:
        meter_id: The meter ID for the user
    """
    with session_lock:
        session = active_sessions.get(meter_id)
        if not session or session["status"] != "active":
            return

    sim_time = session["sim_time"]
    logger.info(f"[{meter_id}] Tick #{session['tick_count']+1} at {sim_time}")

    # 1. User's model predicts for this hour
    try:
        predicted_kwh = predict_with_user_model(meter_id, sim_time)
    except Exception as e:
        logger.error(f"[{meter_id}] Prediction failed: {e}")
        predicted_kwh = None

    # 2. Hit simulator for "true" consumption
    true_kwh = None
    meter_values = {}
    try:
        resp = requests.post(SIMULATOR_URL, json={
            "timestamp": sim_time,
            "meter_id": meter_id,
        }, timeout=5)
        if resp.status_code == 200:
            result = resp.json()
            true_kwh = result["predicted_consumption_kwh"]
            meter_values = result.get("dynamic_meter_values", {})
        else:
            logger.error(f"[{meter_id}] Simulator error: {resp.text}")
    except Exception as e:
        logger.error(f"[{meter_id}] Simulator unreachable: {e}")

    # 3. Store in DB
    if true_kwh is not None:
        insert_consumption(meter_id, sim_time, meter_values, true_kwh, predicted_kwh)
        send_to_backend(meter_id)

    # 4. Update session
    error = None
    if true_kwh is not None and predicted_kwh is not None:
        error = round(abs(true_kwh - predicted_kwh), 6)

    with session_lock:
        session["tick_count"] += 1
        session["last_true_kwh"] = true_kwh
        session["last_predicted_kwh"] = predicted_kwh
        session["last_error"] = error
        if true_kwh is not None:
            session["new_data_since_retrain"] += 1
            session["total_data_points"] += 1

        # Advance simulation time by 1 hour
        next_time = pd.to_datetime(sim_time) + timedelta(hours=1)
        session["sim_time"] = next_time.strftime("%Y-%m-%d %H:%M:%S")

    # 5. Retrain if enough new data
    if session["new_data_since_retrain"] >= RETRAIN_THRESHOLD:
        try:
            success = retrain_user_model(meter_id)
            if success:
                with session_lock:
                    session["new_data_since_retrain"] = 0
                    session["model_version"] += 1
                logger.info(f"[{meter_id}] Model retrained (v{session['model_version']})")
        except Exception as e:
            logger.error(f"[{meter_id}] Retrain failed: {e}")

    logger.info(
        f"[{meter_id}] True={true_kwh}, Predicted={predicted_kwh}, Error={error}"
    )


def start_user_scheduler(meter_id: str):
    """
    Start hourly tick job for a user.
    
    Args:
        meter_id: The meter ID for the user
    """
    if meter_id in scheduler_jobs:
        return  # Already running

    job = scheduler.add_job(
        hourly_tick,
        "interval",
        seconds=TICK_INTERVAL_SECONDS,
        args=[meter_id],
        id=f"tick_{meter_id}",
        replace_existing=True,
    )
    scheduler_jobs[meter_id] = job.id
    logger.info(f"Started scheduler for {meter_id} (every {TICK_INTERVAL_SECONDS}s)")


def stop_user_scheduler(meter_id: str):
    """
    Stop hourly tick job for a user.
    
    Args:
        meter_id: The meter ID for the user
    """
    if meter_id in scheduler_jobs:
        try:
            scheduler.remove_job(scheduler_jobs[meter_id])
        except Exception:
            pass
        del scheduler_jobs[meter_id]
        with session_lock:
            if meter_id in active_sessions:
                active_sessions[meter_id]["status"] = "stopped"


def get_session(meter_id: str) -> dict:
    """
    Get a user's session data.
    
    Args:
        meter_id: The meter ID for the user
        
    Returns:
        Session dictionary or None if not found
    """
    with session_lock:
        return active_sessions.get(meter_id)


def get_all_sessions() -> dict:
    """
    Get all active sessions.
    
    Returns:
        Dictionary of all active sessions
    """
    with session_lock:
        return {
            mid: {k: v for k, v in s.items()}
            for mid, s in active_sessions.items()
        }


def start_scheduler():
    """Start the background scheduler."""
    scheduler.start()
    logger.info("Scheduler started")


def stop_scheduler():
    """Stop the background scheduler."""
    scheduler.shutdown()

def send_to_backend(meter_id: str):
    """Send tick data to backend API."""
    async def dashboard(meter_id: str):
        """Get current dashboard state for a meter."""
        session = get_session(meter_id)

        if not session:
            print(f"Session not found for meter_id: {meter_id}")
            

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
        resp = requests.post("http://localhost:8000/meter_update", json={
            "meter_id": meter_id,
            #"sim_time": session["sim_time"], 
            #"tick_count": session["tick_count"], 
            "consumption_kw": session["last_true_kwh"], 
            "last_predicted_kwh": session["last_predicted_kwh"], 
            #"last_error": session["last_error"],
            #"model_version": session["model_version"],
            #"new_data_since_retrain": session["new_data_since_retrain"],
            #"retrain_threshold": RETRAIN_THRESHOLD,
            #"status": session["status"],
            #"mae": mae,
            #"prediction_log": pred_log,
            "predictions_24h": predictions_24h,
            "predictions_week": predictions_week, 
        })
        if resp.status_code != 200:
            print(f"Failed to send data to backend: {resp.text}")   
        else:
            print(f"Data sent to backend for meter_id: {meter_id}")   