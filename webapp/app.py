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
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import BASE_DIR, logger
from routes import router
from sessions import start_scheduler, stop_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for the FastAPI application."""
    start_scheduler()
    yield
    stop_scheduler()


# ──────────────────────────────────────────────
# FastAPI Application Setup
# ──────────────────────────────────────────────
app = FastAPI(title="Energy Consumption Dashboard", lifespan=lifespan)

# Add CORS Middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production if necessary
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
# app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# Include routes
app.include_router(router)


# ──────────────────────────────────────────────
# Main Entry Point
# ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
