#!/bin/bash

# Set default values
HOST="0.0.0.0"
PORT="8000"
APP_MODULE="main.server:app"
RELOAD=""

# --- Help Message ---
usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --port <port>       Specify the port to run on (default: 8000)"
    echo "  --app <module:app>  Specify the app module (default: main:app)"
    echo "  --reload            Enable auto-reload for development"
    echo "  -h, --help          Display this help message"
}

# --- Parse Command-Line Arguments ---
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --port) PORT="$2"; shift ;;
        --app) APP_MODULE="$2"; shift ;;
        --reload) RELOAD="--reload" ;;
        -h|--help) usage; exit 0 ;;
        *) echo "Unknown parameter passed: $1"; usage; exit 1 ;;
    esac
    shift
done

# --- Execution ---
echo "🚀 Starting Uvicorn server for '$APP_MODULE'"
echo "👂 Listening on: http://$HOST:$PORT"
if [[ -n "$RELOAD" ]]; then
    echo "🔃 Auto-reload is enabled."
fi

# Execute the uvicorn command
uvicorn $APP_MODULE --host $HOST --port $PORT $RELOAD