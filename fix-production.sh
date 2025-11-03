#!/bin/bash

echo "=========================================="
echo "  NextGen English - Production Fixes"
echo "=========================================="

# 1. Fix JWT_SECRET
echo "[1/5] Fixing JWT_SECRET..."
cd ~/NextGen-English/backend
if grep -q "NextGenEnglish_Super_Secure_JWT_Secret_Key_2025_Change_This_In_Production" .env; then
  sed -i 's/JWT_SECRET=.*/JWT_SECRET=cf42aa5bcf2d15faf570c87f74f12e5c4559fab61d9541cd2d11938dba04e9cd/' .env
  echo "✓ JWT_SECRET updated"
else
  echo "✓ JWT_SECRET already configured"
fi

# 2. Fix uploads permissions
echo "[2/5] Fixing uploads permissions..."
sudo chown -R deploy:deploy ~/NextGen-English/backend/uploads/
chmod -R 755 ~/NextGen-English/backend/uploads/
echo "✓ Permissions fixed"

# 3. Ensure upload directories exist
echo "[3/5] Creating upload directories..."
mkdir -p ~/NextGen-English/backend/uploads/images/temp
mkdir -p ~/NextGen-English/backend/uploads/videos
echo "✓ Directories created"

# 4. Check MongoDB is running
echo "[4/5] Checking MongoDB..."
if systemctl is-active --quiet mongod || systemctl is-active --quiet mongodb; then
  echo "✓ MongoDB is running"
else
  echo "⚠ MongoDB is not running. Starting..."
  sudo systemctl start mongod 2>/dev/null || sudo systemctl start mongodb 2>/dev/null
  sleep 2
  if systemctl is-active --quiet mongod || systemctl is-active --quiet mongodb; then
    echo "✓ MongoDB started"
  else
    echo "✗ Failed to start MongoDB. Please check manually."
  fi
fi

# 5. Restart backend
echo "[5/5] Restarting backend..."
pm2 restart nextgen-backend
sleep 2
pm2 status

echo ""
echo "=========================================="
echo "  Fixes Applied Successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Test API: curl http://localhost:5000/health"
echo "2. Check logs: pm2 logs nextgen-backend"
echo "3. Test website: curl https://nextgenenglish.id.vn"
