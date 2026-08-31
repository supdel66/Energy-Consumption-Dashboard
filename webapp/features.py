"""
Feature engineering functions for energy consumption prediction.
Mirrors the simulator's feature extraction exactly.
"""

import numpy as np
import pandas as pd


def extract_time_features(ts: pd.Timestamp) -> dict:
    """
    Extract time-based features from a timestamp.
    
    Args:
        ts: pandas Timestamp object
        
    Returns:
        Dictionary containing time-based features
    """
    feats = {
        "Hour": ts.hour,
        "Month": ts.month,
        "DayOfMonth": ts.day,
        "DayOfWeek": ts.dayofweek,
        "IsWeekend": 1 if ts.dayofweek in [5, 6] else 0,
    }
    feats["Hour_x_IsWeekend"] = feats["Hour"] * feats["IsWeekend"]
    feats["Month_x_Hour"] = feats["Month"] * feats["Hour"]
    feats["Hour_sin"] = np.sin(2 * np.pi * feats["Hour"] / 24)
    feats["Hour_cos"] = np.cos(2 * np.pi * feats["Hour"] / 24)
    feats["Month_sin"] = np.sin(2 * np.pi * feats["Month"] / 12)
    feats["Month_cos"] = np.cos(2 * np.pi * feats["Month"] / 12)
    return feats


def build_features_from_df(df: pd.DataFrame) -> pd.DataFrame:
    """
    Build full feature set from raw consumption data (for retraining).
    
    Args:
        df: DataFrame with consumption data including 'Data Time' and 'Hourly_Kwh'
        
    Returns:
        DataFrame with all engineered features
    """
    df = df.copy()
    df["Data Time"] = pd.to_datetime(df["Data Time"])
    df = df.sort_values("Data Time").reset_index(drop=True)

    # Time features
    df["Hour"] = df["Data Time"].dt.hour
    df["Month"] = df["Data Time"].dt.month
    df["DayOfMonth"] = df["Data Time"].dt.day
    df["DayOfWeek"] = df["Data Time"].dt.dayofweek
    df["IsWeekend"] = (df["DayOfWeek"].isin([5, 6])).astype(int)
    df["Hour_x_IsWeekend"] = df["Hour"] * df["IsWeekend"]
    df["Month_x_Hour"] = df["Month"] * df["Hour"]
    df["Hour_sin"] = np.sin(2 * np.pi * df["Hour"] / 24)
    df["Hour_cos"] = np.cos(2 * np.pi * df["Hour"] / 24)
    df["Month_sin"] = np.sin(2 * np.pi * df["Month"] / 12)
    df["Month_cos"] = np.cos(2 * np.pi * df["Month"] / 12)

    # Lag features
    df["lag_1"] = df["Hourly_Kwh"].shift(1)
    df["lag_2"] = df["Hourly_Kwh"].shift(2)
    df["lag_3"] = df["Hourly_Kwh"].shift(3)

    # Rolling means
    df["roll_mean_3"] = df["Hourly_Kwh"].shift(1).rolling(3).mean()
    df["roll_mean_6"] = df["Hourly_Kwh"].shift(1).rolling(6).mean()
    df["roll_mean_12"] = df["Hourly_Kwh"].shift(1).rolling(12).mean()

    df = df.dropna().reset_index(drop=True)
    return df
