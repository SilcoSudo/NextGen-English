# Deployment Guide for DigitalOcean Droplet (Direct Deployment - No Docker)

## Prerequisites
- DigitalOcean Droplet with Ubuntu/Debian (recommended: 2GB RAM, 1 CPU)
- Git repository access
- Domain: nextgenenglish.id.vn configured with Cloudflare

## Steps

### 1. Initial Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (local) or use MongoDB Atlas
# For local MongoDB:
sudo apt-get install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2 for process management
sudo npm install -g pm2

# Install git
sudo apt install git -y
```

### 2. Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/SilcoSudo/NextGen-English.git
sudo chown -R $USER:$USER NextGen-English
cd NextGen-English
```

### 3. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file
sudo nano .env
```

Add to .env:
```
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
DOMAIN=nextgenenglish.id.vn

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nextgen_english

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here_change_this

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
```

```bash
# Seed database (optional)
npm run seed

# Start with PM2
pm2 start server.js --name "nextgen-backend"
pm2 save
pm2 startup

# Create uploads directory
sudo mkdir -p uploads/images/temp uploads/videos
sudo chown -R $USER:$USER uploads
```

### 4. Setup Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Build production
npm run build

# Copy build files to nginx
sudo cp -r build/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
```

### 5. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/nextgenenglish
```

Add configuration:
```
server {
    listen 80;
    server_name nextgenenglish.id.vn www.nextgenenglish.id.vn;

    # Frontend (React SPA)
    root /var/www/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
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
    return 301 http://nextgenenglish.id.vn$request_uri;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/nextgenenglish /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Setup Cloudflare Tunnel (keep existing setup)
```bash
# Install cloudflared (if not already)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Login (if not already)
cloudflared tunnel login

# Your existing tunnel should work with the new server
# Just make sure DNS points to the tunnel
```

### 7. SSL Certificate (Let's Encrypt)
```bash
# Install certbot
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get certificate
sudo certbot --nginx -d nextgenenglish.id.vn -d www.nextgenenglish.id.vn
```

### 8. Monitoring and Logs
```bash
# Check PM2 status
pm2 status
pm2 logs nextgen-backend

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

## Update Process
When you push changes to Git:
```bash
cd /var/www/NextGen-English

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install
pm2 restart nextgen-backend

# Update frontend
cd ../frontend
npm install
npm run build
sudo cp -r build/* /var/www/html/
sudo systemctl reload nginx
```

## Firewall (UFW)
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## Notes
- Backend runs on port 5000 (internal)
- Frontend served by nginx on port 80
- MongoDB on port 27017 (internal)
- Use PM2 for process management and auto-restart
- SSL handled by Cloudflare, but Let's Encrypt as backup
- Domain remains nextgenenglish.id.vn