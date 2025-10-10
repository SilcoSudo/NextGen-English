#!/bin/bash
# Production build script for NextGen English

echo "🚀 Building NextGen English for Production..."

# Stop any running instances
echo "📦 Stopping existing services..."
pkill -f "nextgen"
pkill -f "node.*server.js"

# Build Frontend
echo "🔨 Building Frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Frontend build failed!"
  exit 1
fi
cd ..

# Install Backend Dependencies (production only)
echo "📦 Installing Backend Dependencies..."
cd backend
npm ci --only=production
if [ $? -ne 0 ]; then
  echo "❌ Backend dependency installation failed!"
  exit 1
fi
cd ..

echo "✅ Build completed successfully!"
echo "📁 Frontend build is in ./frontend/build/"
echo "🚀 Ready to deploy!"

# Copy production env file
cp backend/.env.production backend/.env

echo "🌐 To start production server:"
echo "cd backend && NODE_ENV=production npm start"