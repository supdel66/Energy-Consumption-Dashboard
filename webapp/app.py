"""
Energy Consumption Web App
- Login with meter_id
- Show true (from simulator) vs predicted (user's model) consumption
- Hourly: fetch true from simulator, store in DB, retrain model, predict
- Each user gets their own model.pkl + SQLite DB, diverging from base over time

This is the main entry point. The code is organized into modules:
- config.py: Configuration settings and constants
- features.py: Feature engineering functions
- database.py: SQLite database operations
- models.py: ML model management (load, save, train, predict)
- sessions.py: User session and scheduler management
- routes.py: FastAPI route handlers
"""

import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from config import BASE_DIR, logger
from routes import router
from sessions import start_scheduler, stop_scheduler


# ──────────────────────────────────────────────
# FastAPI Application Setup
# ──────────────────────────────────────────────
app = FastAPI(title="Energy Consumption Dashboard")

# Mount static files
# app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# Include routes
app.include_router(router)


# ──────────────────────────────────────────────
# Lifecycle Events
# ──────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    """Start the background scheduler on app startup."""
    start_scheduler()


@app.on_event("shutdown")
def on_shutdown():
    """Stop the background scheduler on app shutdown."""
    stop_scheduler()


# ──────────────────────────────────────────────
# Main Entry Point
# ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
