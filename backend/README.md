# NextGen English Backend API

Backend API cho nền tảng học tiếng Anh trực tuyến NextGen English.

## 🚀 Tính năng

- ✅ Xác thực người dùng với JWT
- ✅ Đăng ký và đăng nhập
- ✅ Middleware bảo mật
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Validation dữ liệu
- ✅ Mock database với user mẫu

## 📦 Cài đặt

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Chạy server development
npm run dev

# Hoặc chạy server production
npm start
```

## 🔧 Environment Variables

Tạo file `.env` với nội dung:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/login` | Đăng nhập | Public |
| POST | `/api/auth/register` | Đăng ký | Public |
| GET | `/api/auth/me` | Lấy thông tin user | Private |
| POST | `/api/auth/logout` | Đăng xuất | Private |
| POST | `/api/auth/refresh` | Làm mới token | Private |
| PUT | `/api/auth/profile` | Cập nhật thông tin | Private |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Kiểm tra trạng thái server |
| GET | `/` | Thông tin API |

## 🧪 Test API

### 1. Đăng nhập với tài khoản admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin",
    "password": "admin123"
  }'
```

### 2. Đăng nhập với tài khoản student

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "emma",
    "password": "student123"
  }'
```

### 3. Đăng ký tài khoản mới

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyen Van A",
    "username": "nguyenvana",
    "email": "nguyenvana@gmail.com",
    "password": "Password123"
  }'
```

### 4. Lấy thông tin user (cần token)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 👤 Tài khoản mẫu

### Admin
- **Username:** `admin`
- **Email:** `admin@nextgen.com`
- **Password:** `admin123`
- **Role:** `admin`

### Student
- **Username:** `emma`
- **Email:** `emma@student.com`
- **Password:** `student123`
- **Role:** `student`

## 🔒 Security Features

- **JWT Authentication:** Token-based authentication
- **Password Hashing:** bcryptjs với salt rounds = 10
- **Rate Limiting:** 100 requests per 15 minutes
- **CORS:** Cấu hình cho frontend
- **Helmet:** Security headers
- **Input Validation:** express-validator

## 📁 Cấu trúc thư mục

```
backend/
├── controllers/        # Business logic
│   └── authController.js
├── middleware/         # Custom middleware
│   └── auth.js
├── models/            # Data models
│   └── User.js
├── routes/            # API routes
│   └── auth.js
├── config/            # Configuration files
├── .env               # Environment variables
├── server.js          # Main server file
└── package.json       # Dependencies
```

## 🔄 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Thành công",
  "data": {...}
}
```

### Error Response
```json
{
  "error": "Lỗi",
  "message": "Mô tả chi tiết lỗi"
}
```

## 🚀 Triển khai

1. **Development:**
   ```bash
   npm run dev
   ```

2. **Production:**
   ```bash
   npm start
   ```

## 📞 Hỗ trợ

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ team phát triển.

---

**Made with ❤️ by NextGen English Team**