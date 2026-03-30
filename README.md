
# Energy Consumption Prediction Dashboard

This project is a real-time web application for forecasting electricity usage using machine learning. Each user (meter) receives a personalized XGBoost model that adapts and improves as more consumption data is collected. The system features a simulator for generating data, automatic model retraining, and a user-friendly dashboard for monitoring predictions and actual usage.

---


## Features

- **Real-time Predictions**: Instantly compare predicted and actual energy consumption
- **Personalized ML Models**: Each meter ID has its own XGBoost model that evolves over time
- **Automatic Retraining**: Models retrain automatically as new data is collected
- **24-hour & Weekly Forecasts**: Visualize short- and long-term predictions
- **Simulation Mode**: Demo mode simulates hourly data every 15 seconds for rapid testing

---


## Project Architecture

```
WebAppProject/
├── requirements.txt         # Python dependencies
├── README.md                # Project documentation
├── simulator/               # Data simulator (Flask API)
│   ├── api.py               # Simulator API endpoint
│   └── data.csv             # Historical data
└── webapp/                  # Main web application (FastAPI)
    ├── app.py               # Application entry point
    ├── config.py            # Configuration settings
    ├── features.py          # Feature engineering
    ├── database.py          # SQLite operations
    ├── models.py            # ML model management
    ├── sessions.py          # User session & scheduler
    ├── routes.py            # API endpoints
    ├── base/                # Base model/data
    ├── templates/           # HTML templates
    └── user_data/           # Per-user data storage
```

---

## Project Workflow

```mermaid
flowchart TD
    A[User Login (meter_id)] --> B[User folder & DB initialized]
    B --> C[Start Simulation Loop]
    C --> D[Model predicts consumption]
    D --> E[Simulator returns true value]
    E --> F[Store data & log error]
    F --> G{Enough new data?}
    G -- Yes --> H[Retrain user model]
    G -- No --> C
    H --> C
```

### Step-by-step:
1. **User Login**: User enters their meter ID. The system creates a dedicated folder and database for the user, copying the base model.
2. **Initialization**: The user's database is seeded with historical data.
3. **Simulation Loop**: On each tick (every 15s in demo), the user's model predicts consumption, the simulator provides the actual value, and both are stored.
4. **Retraining**: After a set number of new data points, the user's model retrains on all accumulated data, personalizing predictions.
5. **Continuous Learning**: The process repeats, with each user's model improving based on their unique consumption patterns.

---

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


## How the System Works

- **Personalized Models**: Each user (meter) has a separate XGBoost model, initialized from a base model, and retrained as new data arrives.
- **Real-time Feedback**: The dashboard displays both predicted and actual consumption, updating live as the simulator generates new data.
- **Automatic Retraining**: When enough new data is collected, the user's model is retrained, allowing it to diverge and specialize for that user's consumption habits.
- **Simulation Mode**: For demo/testing, the simulator generates new data every 15 seconds, mimicking real-world hourly updates.

---

## Tech Stack

- **Backend**: FastAPI, Python 3.8+
- **ML**: XGBoost, scikit-learn
- **Database**: SQLite (per-user)
- **Scheduler**: APScheduler
- **Simulator**: Flask
- **Frontend**: HTML/CSS/JavaScript

## License

MIT License
