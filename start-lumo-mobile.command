#!/bin/zsh
# Serves the mobile-first Lumo webapp locally.
cd "$(dirname "$0")"
PORT=8643
HOST_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")
if ! lsof -i :$PORT >/dev/null 2>&1; then
  echo "Lumo Mobile is running."
  echo "Mac:   http://127.0.0.1:$PORT/mobile.html"
  echo "Phone: http://$HOST_IP:$PORT/mobile.html"
  ( sleep 1; open -a Safari "http://127.0.0.1:$PORT/mobile.html" ) &
  exec python3 -m http.server $PORT --bind 0.0.0.0
else
  open -a Safari "http://127.0.0.1:$PORT/mobile.html"
fi
