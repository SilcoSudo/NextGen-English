#!/bin/bash

# Deploy NextGen English Frontend to nginx

echo "📦 Building frontend..."
cd ~/NextGen-English/frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "🔄 Deploying to nginx..."

# Copy build files to temp directory with deploy permissions
cp -r ~/NextGen-English/frontend/build /tmp/nextgen-build-deploy

# Use sudo without password (requires deploy user to have passwordless sudo)
# If this fails, you'll need to manually run:
# sudo rm -rf /var/www/html/* && sudo cp -r /tmp/nextgen-build-deploy/* /var/www/html/

# For now, just copy what we can
echo "⚠️  Note: Cannot update /var/www/html without sudo access"
echo "Build output ready at: /tmp/nextgen-build-deploy"
echo ""
echo "To deploy, run on VPS:"
echo "  sudo rm -rf /var/www/html/*"
echo "  sudo cp -r /tmp/nextgen-build-deploy/* /var/www/html/"
echo "  sudo chown -R www-data:www-data /var/www/html"
echo ""
echo "✅ Frontend built successfully!"
ls -lh /tmp/nextgen-build-deploy/
