"""
FastAPI route handlers for the Energy Consumption Dashboard.
"""

import numpy as np
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

from config import BASE_DIR, TICK_INTERVAL_SECONDS, RETRAIN_THRESHOLD
from database import get_recent_predictions, get_consumption_history
from models import predict_with_user_model, predict_next_hours
from sessions import (
    setup_user, start_user_scheduler, stop_user_scheduler,
    get_session, get_all_sessions
)
from sessions import send_to_backend

import os

# Templates setup
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# Create router
router = APIRouter()


# ── Page Routes ──
@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """Render the main dashboard page."""
    return templates.TemplateResponse(request=request, name="index.html")


# ── API Endpoints ──
@router.post("/api/login")
async def login(request: Request):
    """
    Login with meter_id. Sets up user folder, model, DB, and starts scheduler.
    """
    body = await request.json()
    meter_id = body.get("meter_id", "").strip()
    if not meter_id:
        return JSONResponse({"error": "meter_id is required"}, status_code=400)

    # Setup user (idempotent)
    session = setup_user(meter_id)

    # Start scheduler for this user
    start_user_scheduler(meter_id)

    # Get initial prediction for next hour
    next_hour_pred = predict_with_user_model(meter_id, session["sim_time"])

    # Get next 24h predictions
    predictions_24h = predict_next_hours(meter_id, session["sim_time"], 24)
    send_to_backend(meter_id)  # Send initial data to backend

    return JSONResponse({
        "status": "ok",
        "meter_id": meter_id,
        "sim_time": session["sim_time"],
        "next_hour_prediction": next_hour_pred,
        "predictions_24h": predictions_24h,
        "tick_interval_seconds": TICK_INTERVAL_SECONDS,
    })


@router.get("/api/dashboard/{meter_id}")
async def dashboard(meter_id: str):
    """Get current dashboard state for a meter."""
    session = get_session(meter_id)

    if not session:
        return JSONResponse({"error": "Not logged in"}, status_code=404)

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

    return JSONResponse({
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


@router.get("/api/history/{meter_id}")
async def history(meter_id: str, limit: int = 168):
    """Get recent consumption history."""
    data = get_consumption_history(meter_id, limit)
    return JSONResponse({"meter_id": meter_id, "history": data})


@router.post("/api/logout")
async def logout(request: Request):
    """Stop scheduler for a meter."""
    body = await request.json()
    meter_id = body.get("meter_id", "").strip()
    if meter_id:
        stop_user_scheduler(meter_id)
    return JSONResponse({"status": "ok"})


@router.get("/api/active_sessions")
async def active_sessions_endpoint():
    """List all active sessions (for debugging)."""
    return JSONResponse(get_all_sessions())
