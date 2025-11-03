#!/bin/bash

# NextGen English - Direct Deployment Script for DigitalOcean Droplet
# Run this script as root or with sudo

echo "🚀 Starting NextGen English deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install MongoDB
echo "📦 Installing MongoDB..."
sudo apt-get install gnupg -y
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install git
echo "📦 Installing Git..."
sudo apt install git -y

# Create web directory
echo "📁 Creating web directories..."
sudo mkdir -p /var/www
cd /var/www

# Clone repository (replace with your actual repo URL if different)
echo "📥 Cloning repository..."
sudo git clone https://github.com/SilcoSudo/NextGen-English.git
sudo chown -R $USER:$USER NextGen-English
cd NextGen-English

# Setup Backend
echo "⚙️ Setting up Backend..."
cd backend

# Install backend dependencies
npm install

# Create .env file (you need to edit this with your actual values)
cat > .env << EOF
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
DOMAIN=nextgenenglish.id.vn

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nextgen_english

# JWT Configuration (CHANGE THIS TO A SECURE SECRET!)
JWT_SECRET=your_secure_jwt_secret_here_change_this_$(openssl rand -hex 32)

# Email Configuration (configure if needed)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# File Upload Configuration
MAX_FILE_SIZE=104857600
UPLOAD_PATH=./uploads

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
FRONTEND_URL=https://nextgenenglish.id.vn
BACKEND_URL=https://api.nextgenenglish.id.vn
ALLOWED_ORIGINS=https://nextgenenglish.id.vn,https://api.nextgenenglish.id.vn
EOF

echo "⚠️  IMPORTANT: Edit the .env file with your actual values!"
echo "   - Change JWT_SECRET to a secure random string"
echo "   - Add your email credentials if needed"
echo "   - Verify MongoDB URI"

# Create uploads directory
sudo mkdir -p uploads/images/temp uploads/videos
sudo chown -R $USER:$USER uploads

# Seed database (optional - comment out if not needed)
echo "🌱 Seeding database..."
npm run seed

# Start backend with PM2
echo "▶️ Starting backend with PM2..."
pm2 start server.js --name "nextgen-backend"
pm2 save
pm2 startup

# Setup Frontend
echo "⚙️ Setting up Frontend..."
cd ../frontend

# Install frontend dependencies
npm install

# Build production
npm run build

# Copy build files to nginx
sudo cp -r build/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html

# Configure Nginx
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/nextgenenglish > /dev/null <<EOF
server {
    listen 80;
    server_name nextgenenglish.id.vn www.nextgenenglish.id.vn;

    # Frontend (React SPA)
    root /var/www/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}

# Redirect www to non-www
server {
    listen 80;
    server_name www.nextgenenglish.id.vn;
    return 301 http://nextgenenglish.id.vn\$request_uri;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/nextgenenglish /etc/nginx/sites-enabled/ 2>/dev/null || true
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
echo "🔒 Setting up SSL certificate..."
sudo apt install snapd -y
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate (uncomment and run manually if needed)
# sudo certbot --nginx -d nextgenenglish.id.vn -d www.nextgenenglish.id.vn

# Setup Firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw --force enable

# Install cloudflared for Cloudflare Tunnel
echo "🌐 Installing Cloudflare Tunnel..."
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit /var/www/NextGen-English/backend/.env with your actual values"
echo "2. Run: sudo certbot --nginx -d nextgenenglish.id.vn -d www.nextgenenglish.id.vn"
echo "3. Setup Cloudflare Tunnel: cloudflared tunnel login"
echo "4. Check status: pm2 status && sudo systemctl status nginx && sudo systemctl status mongod"
echo ""
echo "🌐 Your site should be available at: https://nextgenenglish.id.vn"
echo "🔗 API available at: https://api.nextgenenglish.id.vn (if configured)"