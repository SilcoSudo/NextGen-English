#!/bin/bash

# Deploy NextGen English to Production

echo "🚀 Deploying NextGen English to Production..."
echo "Domain: nextgenenglish.id.vn"
echo ""

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed! Please install Node.js first."
    exit 1
fi

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Create logs directory
mkdir -p backend/logs

echo "🔨 Building application..."
./build-production.sh

echo "🚀 Starting with PM2..."
pm2 stop nextgen-english 2>/dev/null
pm2 delete nextgen-english 2>/dev/null
pm2 start ecosystem.config.json --env production

echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🌐 Your application should be running on:"
echo "   - Local: http://localhost:5000"
echo "   - Domain: https://nextgenenglish.id.vn (after DNS propagation)"
echo ""
echo "📋 Useful PM2 commands:"
echo "   pm2 status          - Check application status"
echo "   pm2 logs            - View logs"
echo "   pm2 restart all     - Restart application"
echo "   pm2 stop all        - Stop application"
echo "   pm2 delete all      - Delete application from PM2"
echo ""
echo "🔧 Next steps:"
echo "1. Configure your firewall to allow port 5000"
echo "2. Set up SSL certificates (Let's Encrypt recommended)"
echo "3. Configure Nginx as reverse proxy (optional)"
echo "4. Set up your email SMTP credentials in .env.production"
echo ""