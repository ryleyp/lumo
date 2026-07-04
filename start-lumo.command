#!/bin/zsh
# Serves Lumo locally so the on-device AI subject detection can load
# (browsers block ML model files on file:// pages). Double-click to run.
cd "$(dirname "$0")"
PORT=8642
if ! lsof -i :$PORT >/dev/null 2>&1; then
  ( sleep 1; open -a Safari "http://127.0.0.1:$PORT" ) &
  exec python3 -m http.server $PORT --bind 127.0.0.1
else
  open -a Safari "http://127.0.0.1:$PORT"
fi
