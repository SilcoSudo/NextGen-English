@echo off
echo ========================================
echo    NextGen English - Auto Startup
echo ========================================
echo.

REM Set production environment
set NODE_ENV=production

REM Change to project directory
cd /d "D:\Code\Fork\NextGen-English"

echo [1/3] Starting Backend Server...
start "NextGen Backend" cmd /k "cd backend && yarn start"

echo [2/3] Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo [3/3] Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cmd /k "cloudflared tunnel run nextgen-english"

echo.
echo ========================================
echo   NextGen English is starting up!
echo   Website: https://nextgenenglish.id.vn
echo ========================================
echo.
echo Press any key to close this window...
pause >nul