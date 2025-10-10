@echo off
REM Production build script for NextGen English (Windows)

echo 🚀 Building NextGen English for Production...

REM Stop any running instances
echo 📦 Stopping existing services...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

REM Build Frontend
echo 🔨 Building Frontend...
cd frontend
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed!
    exit /b 1
)
cd ..

REM Install Backend Dependencies (production only)
echo 📦 Installing Backend Dependencies...
cd backend
call npm ci --only=production
if errorlevel 1 (
    echo ❌ Backend dependency installation failed!
    exit /b 1
)
cd ..

echo ✅ Build completed successfully!
echo 📁 Frontend build is in ./frontend/build/
echo 🚀 Ready to deploy!

REM Copy production env file
copy backend\.env.production backend\.env

echo 🌐 To start production server:
echo cd backend ^&^& set NODE_ENV=production ^&^& npm start

pause