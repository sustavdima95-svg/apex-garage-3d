#!/bin/bash
set -e
cd "$(dirname "$0")/.."
if ! command -v ollama >/dev/null 2>&1; then
  export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
fi
if ! command -v ollama >/dev/null 2>&1; then echo 'Install Ollama: https://ollama.com/download'; read -r _; exit 1; fi
if ! curl -fsS --max-time 2 http://127.0.0.1:11434/api/version >/dev/null 2>&1; then
  ollama serve >/tmp/apex-garage-ollama.log 2>&1 &
  sleep 4
fi
echo 'Checking qwen3:14b (first run downloads about 9 GB)...'
ollama pull qwen3:14b
open ./ApexGarage3D.app
