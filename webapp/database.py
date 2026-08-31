"""
Database helper functions for SQLite operations.
Each user has their own SQLite database for consumption data.
"""

import os
import sqlite3
import pandas as pd

from config import USER_DATA_DIR, BASE_DATA_PATH, logger


def get_db_path(meter_id: str) -> str:
    """Get the path to a user's SQLite database."""
    return os.path.join(USER_DATA_DIR, meter_id, "consumption.db")


def get_model_path(meter_id: str) -> str:
    """Get the path to a user's model file."""
    return os.path.join(USER_DATA_DIR, meter_id, "model.pkl")


def init_user_db(meter_id: str):
    """
    Create SQLite DB and seed with base data.
    
    Args:
        meter_id: The meter ID for the user
    """
    db_path = get_db_path(meter_id)
    conn = sqlite3.connect(db_path)
    
    # Create consumption table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS consumption (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cons_id TEXT,
            data_time TEXT UNIQUE,
            active_import REAL,
            active_export REAL,
            reactive_import REAL,
            reactive_export REAL,
            apparent_import REAL,
            apparent_export REAL,
            active_power REAL,
            meter_id TEXT,
            hourly_kwh REAL,
            predicted_kwh REAL,
            source TEXT DEFAULT 'base'
        )
    """)
    
    # Create predictions log table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS predictions_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            true_kwh REAL,
            predicted_kwh REAL,
            error REAL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Check if already seeded
    count = conn.execute("SELECT COUNT(*) FROM consumption").fetchone()[0]
    if count == 0:
        df = pd.read_csv(BASE_DATA_PATH)
        for _, row in df.iterrows():
            conn.execute("""
                INSERT OR IGNORE INTO consumption
                (cons_id, data_time, active_import, active_export,
                 reactive_import, reactive_export, apparent_import,
                 apparent_export, active_power, meter_id, hourly_kwh, source)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'base')
            """, (
                str(row.get("Cons ID", "")),
                str(row["Data Time"]),
                float(row["Active Import(kWh)"]),
                float(row["Active Export(kWh)"]),
                float(row["Reactive Import(kVArh)"]),
                float(row["Reactive Export(kVArh)"]),
                float(row["Apparent Import(kVAh)"]),
                float(row["Apparent Export(kVAh)"]),
                float(row["Active Power(kW)"]),
                meter_id,
                float(row["Hourly_Kwh"]),
            ))
        conn.commit()
        logger.info(f"Seeded DB for {meter_id} with {len(df)} rows")
    conn.close()


def load_user_data(meter_id: str) -> pd.DataFrame:
    """
    Load all consumption data for a user from SQLite.
    
    Args:
        meter_id: The meter ID for the user
        
    Returns:
        DataFrame with consumption data
    """
    db_path = get_db_path(meter_id)
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("""
        SELECT data_time as "Data Time",
               active_import as "Active Import(kWh)",
               active_export as "Active Export(kWh)",
               reactive_import as "Reactive Import(kVArh)",
               reactive_export as "Reactive Export(kVArh)",
               apparent_import as "Apparent Import(kVAh)",
               apparent_export as "Apparent Export(kVAh)",
               active_power as "Active Power(kW)",
               meter_id as "Meter ID",
               hourly_kwh as "Hourly_Kwh"
        FROM consumption ORDER BY data_time
    """, conn)
    conn.close()
    return df


def insert_consumption(meter_id: str, data_time: str, meter_values: dict,
                       hourly_kwh: float, predicted_kwh: float = None):
    """
    Insert a new hourly consumption record (from simulator).
    
    Args:
        meter_id: The meter ID for the user
        data_time: Timestamp string for the data point
        meter_values: Dictionary of meter column values
        hourly_kwh: The actual consumption value
        predicted_kwh: The predicted consumption value (optional)
    """
    db_path = get_db_path(meter_id)
    conn = sqlite3.connect(db_path)
    conn.execute("""
        INSERT OR REPLACE INTO consumption
        (cons_id, data_time, active_import, active_export,
         reactive_import, reactive_export, apparent_import,
         apparent_export, active_power, meter_id, hourly_kwh,
         predicted_kwh, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'simulator')
    """, (
        "",
        data_time,
        meter_values.get("Active Import(kWh)", 0),
        meter_values.get("Active Export(kWh)", 0),
        meter_values.get("Reactive Import(kVArh)", 0),
        meter_values.get("Reactive Export(kVArh)", 0),
        meter_values.get("Apparent Import(kVAh)", 0),
        meter_values.get("Apparent Export(kVAh)", 0),
        meter_values.get("Active Power(kW)", 0),
        meter_id,
        hourly_kwh,
        predicted_kwh,
    ))

    # Also log prediction accuracy
    if predicted_kwh is not None:
        error = abs(hourly_kwh - predicted_kwh)
        conn.execute("""
            INSERT INTO predictions_log (timestamp, true_kwh, predicted_kwh, error)
            VALUES (?, ?, ?, ?)
        """, (data_time, hourly_kwh, predicted_kwh, error))

    conn.commit()
    conn.close()


def get_recent_predictions(meter_id: str, limit: int = 48) -> list:
    """
    Get recent prediction log entries.
    
    Args:
        meter_id: The meter ID for the user
        limit: Maximum number of entries to return
        
    Returns:
        List of prediction log dictionaries
    """
    db_path = get_db_path(meter_id)
    conn = sqlite3.connect(db_path)
    rows = conn.execute("""
        SELECT timestamp, true_kwh, predicted_kwh, error
        FROM predictions_log ORDER BY timestamp DESC LIMIT ?
    """, (limit,)).fetchall()
    conn.close()
    return [
        {"timestamp": r[0], "true_kwh": r[1], "predicted_kwh": r[2], "error": r[3]}
        for r in reversed(rows)
    ]


def get_consumption_history(meter_id: str, limit: int = 168) -> list:
    """
    Get recent hourly consumption (default: last 7 days = 168 hours).
    
    Args:
        meter_id: The meter ID for the user
        limit: Maximum number of hours to return
        
    Returns:
        List of consumption history dictionaries
    """
    db_path = get_db_path(meter_id)
    conn = sqlite3.connect(db_path)
    rows = conn.execute("""
        SELECT data_time, hourly_kwh, predicted_kwh, source
        FROM consumption ORDER BY data_time DESC LIMIT ?
    """, (limit,)).fetchall()
    conn.close()
    return [
        {"timestamp": r[0], "true_kwh": r[1], "predicted_kwh": r[2], "source": r[3]}
        for r in reversed(rows)
    ]
