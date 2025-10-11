# NextGen English - Local Hosting Scripts

## 🚀 Quick Start

### Start Services
```batch
start-nextgen.bat
```
- Khởi động Backend Server (Node.js)
- Khởi động Cloudflare Tunnel
- Website sẽ accessible tại: https://nextgenenglish.id.vn

### Stop Services
```batch
stop-nextgen.bat
```
- Dừng toàn bộ Backend và Tunnel services

### Restart Services
```batch
restart-nextgen.bat
```
- Restart toàn bộ system

## 📁 File Structure
```
NextGen-English/
├── start-nextgen.bat    # Start all services
├── stop-nextgen.bat     # Stop all services
├── restart-nextgen.bat  # Restart all services
├── backend/             # Node.js API server
├── frontend/            # React frontend (built)
└── .cloudflared/        # Tunnel configuration
```

## 🌐 Access Points
- **Production Website**: https://nextgenenglish.id.vn
- **Local Backend**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/nextgen_english

## 👥 Test Accounts
- **Student**: emma@student.com / emma123
- **Teacher**: john@teacher.com / teacher123

## 🔧 Troubleshooting

### Port 5000 already in use
```batch
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

### Tunnel connection issues
- Check Cloudflare dashboard
- Verify DNS records
- Restart tunnel: `cloudflared tunnel run nextgen-english`

### MongoDB connection issues
- Ensure MongoDB service is running
- Check connection string in `.env`

## 📋 Development Notes
- Environment: Production
- SSL: Handled by Cloudflare
- Database: Local MongoDB
- Static Files: Served by Express
- Video/Images: Served from `/uploads`