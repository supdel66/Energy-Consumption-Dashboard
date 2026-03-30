#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BIN="${PYTHON_BIN:-python3}"
VENV_PYTHON="$ROOT_DIR/venv/bin/python"
WEB_PORT="${WEB_PORT:-8000}"
SIM_PORT="${SIM_PORT:-5000}"

if [[ -x "$VENV_PYTHON" ]]; then
  PYTHON_BIN="$VENV_PYTHON"
fi

SIM_LOG="$ROOT_DIR/simulator.log"
WEB_LOG="$ROOT_DIR/webapp.log"

port_in_use() {
  local port="$1"
  ss -ltn "( sport = :$port )" | tail -n +2 | grep -q ":$port"
}

if port_in_use "$SIM_PORT"; then
  SIM_PORT=$((SIM_PORT + 1))
  echo "Port 5000 is busy. Using simulator port ${SIM_PORT}."
fi

if port_in_use "$WEB_PORT"; then
  WEB_PORT=$((WEB_PORT + 1))
  echo "Port 8000 is busy. Using webapp port ${WEB_PORT}."
fi

cleanup() {
  if [[ -n "${WEB_PID:-}" ]] && kill -0 "$WEB_PID" 2>/dev/null; then
    kill "$WEB_PID"
    wait "$WEB_PID" 2>/dev/null || true
  fi
  if [[ -n "${SIM_PID:-}" ]] && kill -0 "$SIM_PID" 2>/dev/null; then
    kill "$SIM_PID"
    wait "$SIM_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting simulator..."
(cd "$ROOT_DIR/simulator" && SIM_PORT="$SIM_PORT" "$PYTHON_BIN" api.py) >"$SIM_LOG" 2>&1 &
SIM_PID=$!

sleep 2
if ! kill -0 "$SIM_PID" 2>/dev/null; then
  echo "Simulator failed to start. Check $SIM_LOG"
  exit 1
fi

echo "Starting webapp..."
(
  cd "$ROOT_DIR/webapp" && \
  BACKEND_URL_METERS="http://localhost:${WEB_PORT}/meter_update" \
  SIMULATOR_URL="http://localhost:${SIM_PORT}/predict" \
  "$PYTHON_BIN" -m uvicorn app:app --host 0.0.0.0 --port "$WEB_PORT"
) >"$WEB_LOG" 2>&1 &
WEB_PID=$!

sleep 2
if ! kill -0 "$WEB_PID" 2>/dev/null; then
  echo "Webapp failed to start. Check $WEB_LOG"
  exit 1
fi

echo "Project started."
echo "Simulator: http://localhost:${SIM_PORT}"
echo "Webapp:    http://localhost:${WEB_PORT}"
echo "Logs:      $SIM_LOG and $WEB_LOG"
echo "Press Ctrl+C to stop."

wait "$SIM_PID" "$WEB_PID"
