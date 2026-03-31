#!/usr/bin/env bash

set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_ACTIVATE="$ROOT_DIR/venv/bin/activate"
LOG_DIR="$ROOT_DIR/logs"

SIMULATOR_DIR="$ROOT_DIR/simulator"
WEBAPP_DIR="$ROOT_DIR/webapp"
FRONTEND_DIR="$ROOT_DIR/mobile-frontend"

SIM_LOG="$LOG_DIR/simulator.log"
WEBAPP_LOG="$LOG_DIR/webapp.log"
FRONTEND_LOG="$LOG_DIR/mobile-frontend.log"

SIM_PID=""
WEBAPP_PID=""
FRONTEND_PID=""

mkdir -p "$LOG_DIR"

if [[ ! -f "$VENV_ACTIVATE" ]]; then
  echo "Error: virtual environment activate script not found at $VENV_ACTIVATE"
  exit 1
fi

if [[ ! -d "$SIMULATOR_DIR" ]]; then
  echo "Error: simulator directory not found at $SIMULATOR_DIR"
  exit 1
fi

if [[ ! -d "$WEBAPP_DIR" ]]; then
  echo "Error: webapp directory not found at $WEBAPP_DIR"
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR" ]]; then
  echo "Error: mobile-frontend directory not found at $FRONTEND_DIR"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not available in PATH"
  exit 1
fi

cleanup() {
  local pids=()

  [[ -n "$SIM_PID" ]] && pids+=("$SIM_PID")
  [[ -n "$WEBAPP_PID" ]] && pids+=("$WEBAPP_PID")
  [[ -n "$FRONTEND_PID" ]] && pids+=("$FRONTEND_PID")

  if [[ ${#pids[@]} -gt 0 ]]; then
    echo "Stopping services..."
    kill "${pids[@]}" >/dev/null 2>&1 || true
    wait "${pids[@]}" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting services..."
echo "Logs:"
echo "  simulator:      $SIM_LOG"
echo "  webapp:         $WEBAPP_LOG"
echo "  mobile-frontend:$FRONTEND_LOG"

(
  source "$VENV_ACTIVATE"
  cd "$SIMULATOR_DIR"
  python api.py
) >>"$SIM_LOG" 2>&1 &
SIM_PID=$!

echo "Started simulator/api.py (pid: $SIM_PID)"

(
  source "$VENV_ACTIVATE"
  cd "$WEBAPP_DIR"
  python app.py
) >>"$WEBAPP_LOG" 2>&1 &
WEBAPP_PID=$!

echo "Started webapp/app.py (pid: $WEBAPP_PID)"

(
  source "$VENV_ACTIVATE"
  cd "$FRONTEND_DIR"
  npm run dev
) >>"$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!

echo "Started mobile-frontend npm dev server (pid: $FRONTEND_PID)"
echo "Press Ctrl+C to stop all services."

wait -n "$SIM_PID" "$WEBAPP_PID" "$FRONTEND_PID"
echo "One of the services exited. Shutting down the rest."
