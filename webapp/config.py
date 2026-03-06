"""
Configuration settings for the Energy Consumption Web App.
"""

import os
import logging

# ──────────────────────────────────────────────
# Paths Configuration
# ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_MODEL_PATH = os.path.join(BASE_DIR, "base", "model.pkl")
BASE_DATA_PATH = os.path.join(BASE_DIR, "base", "data.csv")
USER_DATA_DIR = os.path.join(BASE_DIR, "user_data")

# ──────────────────────────────────────────────
# API Configuration
# ──────────────────────────────────────────────
SIMULATOR_URL = "http://localhost:5000/predict"

# ──────────────────────────────────────────────
# Timing Configuration
# ──────────────────────────────────────────────
# Tick interval: how often (seconds) we simulate 1 hour passing
# Set to 15 for demo (every 15s = 1 simulated hour), 3600 for production
TICK_INTERVAL_SECONDS = 15

# Minimum new data points before retraining
RETRAIN_THRESHOLD = 6

# ──────────────────────────────────────────────
# Feature Configuration
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

TARGET_COL = "Hourly_Kwh"

# ──────────────────────────────────────────────
# Logging Configuration
# ──────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("webapp")
