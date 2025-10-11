@echo off
echo ========================================
echo    NextGen English - Shutdown
echo ========================================
echo.

echo [1/2] Stopping Backend Server...
taskkill /f /im node.exe /t >nul 2>&1

echo [2/2] Stopping Cloudflare Tunnel...
taskkill /f /im cloudflared.exe /t >nul 2>&1

echo.
echo ========================================
echo   All NextGen English services stopped
echo ========================================
echo.
echo Press any key to close...
pause >nul