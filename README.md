# Energy Consumption Prediction Dashboard

A real-time energy consumption prediction web application that uses machine learning to forecast electricity usage. Each user gets their own personalized XGBoost model that continuously learns and improves from actual consumption data.

## Features

- **Real-time Predictions**: Compare predicted vs actual energy consumption
- **Per-user ML Models**: Each meter ID gets its own XGBoost model that diverges from the base model over time
- **Automatic Retraining**: Models automatically retrain when enough new data is collected
- **24-hour & Weekly Forecasts**: View predictions for the next 24 hours or full week
- **Simulation Mode**: Demo mode simulates hourly data ticks every 15 seconds

## Architecture

```
webappproject/
├── requirements.txt          # Python dependencies
├── README.md                 # This file
├── simulator/                # Energy consumption simulator (Flask API)
│   ├── api.py               # Simulator API endpoint
│   ├── model.pkl            # Base prediction model
│   └── data.csv             # Historical data
└── webapp/                   # Main web application (FastAPI)
    ├── app.py               # Application entry point
    ├── config.py            # Configuration settings
    ├── features.py          # Feature engineering functions
    ├── database.py          # SQLite database operations
    ├── models.py            # ML model management
    ├── sessions.py          # User session & scheduler
    ├── routes.py            # API route handlers
    ├── base/                # Base model and data
    │   ├── model.pkl
    │   └── data.csv
    ├── templates/           # HTML templates
    │   └── index.html
    ├── static/              # Static assets (CSS, JS)
    └── user_data/           # Per-user data storage
        └── {meter_id}/
            ├── model.pkl    # User's personalized model
            └── consumption.db  # SQLite database
```

## Module Overview

| Module | Purpose |
|--------|---------|
| `config.py` | Configuration constants, paths, feature columns, logging |
| `features.py` | Time feature extraction, lag features, rolling means |
| `database.py` | SQLite operations: init, insert, query consumption data |
| `models.py` | Load/save models, prediction, retraining with XGBoost |
| `sessions.py` | User session management, background scheduler, simulator communication |
| `routes.py` | FastAPI endpoints for login, dashboard, history, logout |
| `app.py` | Application setup and lifecycle management |

## Installation

1. Clone the repository:
```bash
cd /path/to/webappproject
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

### 1. Start the Simulator (required)
```bash
cd simulator
python api.py
```
The simulator runs on `http://localhost:5000`

### 2. Start the Web App
```bash
cd webapp
python app.py
```
Or with uvicorn:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
The web app runs on `http://localhost:8000`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main dashboard page |
| `/api/login` | POST | Login with meter_id, starts prediction scheduler |
| `/api/dashboard/{meter_id}` | GET | Get current dashboard data (predictions, stats) |
| `/api/history/{meter_id}` | GET | Get consumption history |
| `/api/logout` | POST | Stop scheduler for a meter |
| `/api/active_sessions` | GET | List all active sessions (debug) |

### Login Request
```json
POST /api/login
{
    "meter_id": "M001"
}
```

### Dashboard Response
```json
{
    "meter_id": "M001",
    "sim_time": "2025-01-01 12:00:00",
    "tick_count": 5,
    "last_true_kwh": 2.345,
    "last_predicted_kwh": 2.412,
    "last_error": 0.067,
    "model_version": 1,
    "mae": 0.089,
    "predictions_24h": [...],
    "predictions_week": [...]
}
```

## Configuration

Edit `webapp/config.py` to customize:

```python
# Tick interval (15s for demo, 3600 for production)
TICK_INTERVAL_SECONDS = 15

# Data points before model retraining
RETRAIN_THRESHOLD = 6

# Simulator API URL
SIMULATOR_URL = "http://localhost:5000/predict"
```

## Feature Engineering

The model uses 26 features for prediction:

**Meter Columns (8)**
- Active Import/Export (kWh)
- Reactive Import/Export (kVArh)
- Apparent Import/Export (kVAh)
- Active Power (kW)
- Hourly_Kwh

**Time Features (12)**
- Hour, Month, DayOfMonth, DayOfWeek, IsWeekend
- Cyclic encodings (sin/cos for hour and month)
- Interaction features (Hour×IsWeekend, Month×Hour)

**Lag Features (6)**
- lag_1, lag_2, lag_3
- roll_mean_3, roll_mean_6, roll_mean_12

## How It Works

1. **Login**: User enters meter ID → system creates user folder with base model copy
2. **Initialization**: SQLite DB is seeded with historical data
3. **Simulation Loop** (every tick):
   - User's model predicts consumption for current hour
   - Simulator provides "true" consumption value
   - Data is stored in user's database
   - Prediction error is logged
4. **Retraining**: After 6 new data points, model retrains on all accumulated data
5. **Divergence**: Each user's model improves based on their specific consumption patterns

## Tech Stack

- **Backend**: FastAPI, Python 3.8+
- **ML**: XGBoost, scikit-learn
- **Database**: SQLite (per-user)
- **Scheduler**: APScheduler
- **Simulator**: Flask
- **Frontend**: HTML/CSS/JavaScript

## License

MIT License
