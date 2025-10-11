@echo off
echo ========================================
echo    NextGen English - Restart
echo ========================================
echo.

echo [1/3] Stopping existing services...
call stop-nextgen.bat

echo [2/3] Waiting...
timeout /t 3 /nobreak >nul

echo [3/3] Starting services...
call start-nextgen.bat