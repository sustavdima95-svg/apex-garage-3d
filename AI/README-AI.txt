APEX GARAGE 3D 1.8.1 - LOCAL AI SETUP

1. Extract the whole game archive first.
2. Install Ollama for your computer from https://ollama.com/download
3. Windows: double-click AI/Start-AI-Windows.cmd
   Linux: in a terminal run bash AI/start-ai-linux.sh
   macOS: in a terminal run bash AI/start-ai-mac.command
4. The launcher checks the service, downloads qwen3:14b on first use
   (approximately 9 GB, so allow time and disk space), and opens the game.
5. Inside the game, open the AI car design menu.

After the model has been downloaded, the local AI can work offline.
The game remains playable without Ollama; only the AI design feature needs it.
Ollama serves requests locally on 127.0.0.1:11434. No model weights are
included in this archive. If a different Ollama server is running on this
port, close it before using this launcher.

If the model is already installed, `ollama pull` checks for updates; you may
start the game directly while Ollama is running to avoid that check.
