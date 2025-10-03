@echo off
echo ========================================
echo   NextGen English - Teacher UI Demo
echo ========================================
echo.
echo Dang chuan bi demo cho Teacher UI/UX...
echo.

echo [1/4] Khoi tao backend server...
cd /d "d:\Code\Fork\NextGen-English\backend"
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

echo.
echo [2/4] Khoi tao demo data...
node setupTeacherDemo.js
if %errorlevel% neq 0 (
    echo Warning: Co loi khi khoi tao demo data
)

echo.
echo [3/4] Khoi dong backend server...
start "Backend Server" cmd /k "cd /d d:\Code\Fork\NextGen-English\backend && npm start"

echo.
echo [4/4] Khoi dong frontend server...
cd /d "d:\Code\Fork\NextGen-English\frontend"
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call yarn install
)

echo.
echo ========================================
echo   TEACHER UI/UX DEMO READY!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Demo Teacher Account:
echo Email:    teacher@nextgen.com  
echo Password: Teacher123!
echo.
echo Teacher Preview: http://localhost:3000/#/teacher-preview
echo Teacher Login:   http://localhost:3000/#/login
echo.
echo ========================================
pause

start "Frontend Server" cmd /k "cd /d d:\Code\Fork\NextGen-English\frontend && yarn start"

echo.
echo Servers started! Mo browser de xem demo...
timeout /t 3 /nobreak > nul

start http://localhost:3000/#/teacher-preview