#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if ! command -v ollama >/dev/null 2>&1; then echo 'Install Ollama: https://ollama.com/download'; exit 1; fi
if ! curl -fsS --max-time 2 http://127.0.0.1:11434/api/version >/dev/null 2>&1; then
  ollama serve >/tmp/apex-garage-ollama.log 2>&1 &
  sleep 4
fi
echo 'Checking qwen3:14b (first run downloads about 9 GB)...'
ollama pull qwen3:14b
app=$(find . -maxdepth 1 -type f -name '*.AppImage' -print -quit)
if [[ -z "$app" ]]; then echo 'AppImage not found'; exit 1; fi
chmod +x "$app"
"$app"
