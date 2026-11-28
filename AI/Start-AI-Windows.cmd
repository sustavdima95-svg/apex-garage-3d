@echo off
setlocal
cd /d "%~dp0.."
set "OLLAMA_EXE=ollama"
where ollama >nul 2>&1
if errorlevel 1 (
  set "OLLAMA_EXE=%LOCALAPPDATA%\Programs\Ollama\ollama.exe"
  if not exist "%OLLAMA_EXE%" (
    echo Ollama is not installed. Get it from https://ollama.com/download
    pause
    exit /b 1
  )
)
echo Checking local AI service...
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:11434/api/version' -UseBasicParsing -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  echo Starting Ollama locally...
  start "Apex AI service" /min "%OLLAMA_EXE%" serve
  timeout /t 4 /nobreak >nul
)
echo Installing/checking model qwen3:14b. The first run downloads about 9 GB.
"%OLLAMA_EXE%" pull qwen3:14b
if errorlevel 1 (
  echo AI model could not be installed. Check the connection and free space.
  pause
  exit /b 1
)
if exist "ApexGarage3D.exe" (
  start "" "ApexGarage3D.exe"
) else (
  echo Game executable not found beside the AI folder.
  pause
  exit /b 1
)
