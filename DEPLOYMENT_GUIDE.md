# NextGen English - Production Deployment Guide

## 🚀 Hướng dẫn Deploy lên Server Production

### Yêu cầu hệ thống
- **Server**: VPS/Cloud Server (Ubuntu 20.04+ hoặc Windows Server)
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB+)
- **Storage**: Tối thiểu 20GB
- **CPU**: 2 cores trở lên
- **Network**: Port 80, 443, 5000 mở

### Bước 1: Chuẩn bị Server

#### Trên Ubuntu/Linux:
```bash
# Cập nhật system
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Cài đặt Nginx
sudo apt install nginx -y

# Cài đặt PM2
sudo npm install -g pm2

# Cài đặt Certbot cho SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### Trên Windows Server:
1. Tải và cài đặt Node.js từ https://nodejs.org
2. Tải và cài đặt MongoDB từ https://www.mongodb.com/try/download/community
3. Cài đặt PM2: `npm install -g pm2`

### Bước 2: Clone và Setup Code

```bash
# Clone repository
git clone https://github.com/your-username/NextGen-English.git
cd NextGen-English

# Cài đặt dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Copy và cấu hình environment
cp .env.production.example .env.production
```

### Bước 3: Cấu hình Environment Variables

Chỉnh sửa file `.env.production`:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
DOMAIN=nextgenenglish.id.vn

# Database
MONGODB_URI=mongodb://localhost:27017/nextgen_english_production

# JWT Secret (tạo secret key mạnh)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=100MB
UPLOAD_PATH=/uploads
```

### Bước 4: Cấu hình Database

```bash
# Khởi động MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Import dữ liệu mẫu (nếu có)
cd backend
node seedDatabase.js
```

### Bước 5: Build và Deploy

#### Sử dụng Deploy Script (Khuyến nghị):
```bash
# Trên Linux
chmod +x deploy.sh
./deploy.sh

# Trên Windows
deploy.bat
```

#### Manual Deploy:
```bash
# Build frontend
cd frontend
npm run build

# Khởi động với PM2
cd ..
pm2 start ecosystem.config.json --env production
pm2 save
pm2 startup
```

### Bước 6: Cấu hình Nginx (Linux)

Copy file cấu hình Nginx:
```bash
sudo cp nginx-nextgenenglish.conf /etc/nginx/sites-available/nextgenenglish.id.vn
sudo ln -s /etc/nginx/sites-available/nextgenenglish.id.vn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Bước 7: Cài đặt SSL Certificate

```bash
# Sử dụng Let's Encrypt (miễn phí)
sudo certbot --nginx -d nextgenenglish.id.vn -d www.nextgenenglish.id.vn

# Tự động gia hạn SSL
sudo crontab -e
# Thêm dòng sau:
0 12 * * * /usr/bin/certbot renew --quiet
```

### Bước 8: Cấu hình DNS

Trên nhà cung cấp domain của bạn, cấu hình DNS records:

```
Type    Name                    Value               TTL
A       nextgenenglish.id.vn    YOUR_SERVER_IP      300
CNAME   www                     nextgenenglish.id.vn 300
```

### Bước 9: Kiểm tra và Monitoring

```bash
# Kiểm tra trạng thái PM2
pm2 status
pm2 logs

# Kiểm tra Nginx
sudo systemctl status nginx

# Kiểm tra MongoDB
sudo systemctl status mongod

# Test website
curl -I https://nextgenenglish.id.vn
```

## 🔧 Các lệnh quản lý hữu ích

### PM2 Commands:
```bash
pm2 status                 # Xem trạng thái
pm2 logs                   # Xem logs
pm2 restart nextgen-english # Restart app
pm2 stop nextgen-english   # Stop app
pm2 reload nextgen-english # Reload without downtime
pm2 monit                  # Monitoring dashboard
```

### Nginx Commands:
```bash
sudo systemctl status nginx    # Kiểm tra trạng thái
sudo systemctl reload nginx    # Reload cấu hình
sudo nginx -t                  # Test cấu hình
sudo tail -f /var/log/nginx/error.log  # Xem logs lỗi
```

### Database Backup:
```bash
# Backup MongoDB
mongodump --db nextgen_english_production --out /backup/$(date +%Y%m%d)

# Restore MongoDB
mongorestore --db nextgen_english_production /backup/20240115/nextgen_english_production
```

## 🚨 Troubleshooting

### Lỗi thường gặp:

1. **Port 5000 đã được sử dụng**:
   ```bash
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

2. **MongoDB không kết nối được**:
   ```bash
   sudo systemctl status mongod
   sudo journalctl -u mongod
   ```

3. **SSL Certificate lỗi**:
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

4. **Website không truy cập được**:
   - Kiểm tra firewall: `sudo ufw status`
   - Kiểm tra DNS: `nslookup nextgenenglish.id.vn`
   - Kiểm tra Nginx logs: `sudo tail -f /var/log/nginx/error.log`

## 📊 Performance Optimization

### 1. Enable Gzip Compression (Nginx):
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. Enable Caching:
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. MongoDB Indexing:
```javascript
// Tạo indexes quan trọng
db.users.createIndex({ "email": 1 })
db.courses.createIndex({ "title": "text", "description": "text" })
db.progress.createIndex({ "userId": 1, "courseId": 1 })
```

## 🔐 Security Best Practices

1. **Firewall Configuration**:
   ```bash
   sudo ufw enable
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   ```

2. **MongoDB Security**:
   ```bash
   # Tạo admin user
   mongo
   use admin
   db.createUser({user: "admin", pwd: "secure_password", roles: ["userAdminAnyDatabase"]})
   ```

3. **Regular Updates**:
   ```bash
   # Cập nhật dependencies
   npm audit fix
   
   # Cập nhật system
   sudo apt update && sudo apt upgrade -y
   ```

## 📞 Support

Nếu gặp vấn đề trong quá trình deploy, vui lòng kiểm tra:

1. **Logs**: `pm2 logs` và `/var/log/nginx/error.log`
2. **System Resources**: `htop`, `df -h`, `free -m`
3. **Network**: `netstat -tlnp`, `ss -tlnp`

---

🎉 **Chúc mừng! Website NextGen English của bạn đã sẵn sàng phục vụ học viên tại https://nextgenenglish.id.vn**