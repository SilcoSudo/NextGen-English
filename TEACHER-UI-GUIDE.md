# 🎓 Teacher UI/UX System - NextGen English

## 📋 Tổng quan

Hệ thống Teacher UI/UX được thiết kế đầy đủ với tất cả tính năng cần thiết cho giảng viên tạo và quản lý bài học tiếng Anh.

## 🚀 Cách truy cập

### Option 1: Demo Preview (Không cần đăng nhập)
```
http://localhost:3000/#/teacher-preview
```

### Option 2: Teacher Dashboard (Cần đăng nhập với tài khoản teacher)
```
http://localhost:3000/#/login

Demo Account:
Email: teacher@nextgen.com
Password: Teacher123!
```

## 🎯 Tính năng chính

### 1. **Teacher Dashboard** 
- **Route**: `/teacher`
- **Mô tả**: Dashboard tổng quan với thống kê, tabs navigation
- **Components**: `TeacherDashboard.js`
- **Tính năng**:
  - 📊 Thống kê tổng quan (số bài học, trạng thái xuất bản)
  - 📋 Danh sách bài học gần đây
  - 🎯 Navigation tabs: Tổng quan / Quản lý bài học / Tạo bài học mới

### 2. **Tạo Bài Học Mới**
- **Component**: `CreateLesson.js` 
- **Tính năng**:
  - ✏️ Form tạo bài học với validation
  - 🎥 **3 phương thức upload video**:
    1. **URL Video**: Nhập link YouTube, Vimeo, v.v.
    2. **Upload File**: Upload trực tiếp file video (MP4, AVI, MOV...)
    3. **Chọn từ thư viện**: Sử dụng video đã upload trước đó
  - 📝 Các trường: Tiêu đề, mô tả, cấp độ, thời lượng
  - 💾 Lưu thành công với toast notification

### 3. **Quản Lý Bài Học**
- **Component**: `LessonManagement.js`
- **Tính năng**:
  - 📋 Danh sách tất cả bài học của giảng viên
  - 🔍 Tìm kiếm và lọc theo trạng thái
  - ✏️ Chỉnh sửa bài học
  - 🗑️ Xóa bài học
  - 👁️ Preview bài học
  - 📊 Thống kê chi tiết

### 4. **Video Library**
- **Component**: `VideoLibrary.js`
- **Tính năng**:
  - 📚 Thư viện video cá nhân
  - 📤 Upload video mới
  - 🎬 Preview video với player
  - 🏷️ Tag và categorize videos
  - ♻️ Tái sử dụng video cho nhiều bài học

### 5. **Video Player** 
- **Component**: `VideoPlayer.js`
- **Tính năng**:
  - ▶️ HTML5 video player với controls đầy đủ
  - 🎛️ Play/pause, volume, fullscreen
  - ⏱️ Progress bar và time display
  - 📱 Responsive design

## 🛠️ Technical Stack

### Frontend
- **React 19.1.0**: Modern React với hooks
- **Tailwind CSS**: Utility-first styling
- **React Router**: Navigation và routing
- **Context API**: State management for auth

### Backend  
- **Node.js + Express**: REST API server
- **MongoDB**: Database với Mongoose ODM
- **Multer**: File upload middleware
- **JWT**: Authentication system

### Upload System
- **Multer Configuration**:
  - Max file size: 500MB
  - Supported formats: MP4, AVI, MOV, WMV
  - Storage: Local filesystem với organized folder structure
- **Video Streaming**: Range request support cho efficient streaming

## 📁 File Structure

```
frontend/src/
├── components/
│   ├── TeacherPreview.js      # Demo UI preview (không cần auth)
│   ├── CreateLesson.js        # Form tạo bài học mới  
│   ├── LessonManagement.js    # Quản lý danh sách bài học
│   ├── VideoLibrary.js        # Thư viện video cá nhân
│   └── VideoPlayer.js         # Component phát video
├── views/
│   ├── TeacherDashboard.js    # Main dashboard cho teacher
│   └── teacher/
│       └── TeacherRoute.js    # Protected route cho teacher role
└── controllers/
    └── AppController.js       # Main routing config

backend/
├── controllers/
│   ├── courseController.js    # CRUD operations cho courses
│   └── uploadController.js    # File upload handling
├── middleware/
│   └── teacherAuth.js         # Authorization middleware
├── models/
│   └── Course.js              # MongoDB schema
├── routes/
│   ├── courses.js             # Course API endpoints  
│   └── upload.js              # Upload API endpoints
└── setupTeacherDemo.js        # Demo data generation
```

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Blue primary, với accent colors cho các functions
- **Typography**: Font family responsive với hierarchy rõ ràng  
- **Components**: Consistent button styles, form elements, cards
- **Icons**: RemixIcon set cho consistent iconography

### Responsive Design
- **Mobile First**: Tailwind responsive breakpoints
- **Touch Friendly**: Larger buttons và touch targets
- **Fluid Layout**: Grid system adapts to all screen sizes

### User Experience
- **Loading States**: Skeleton loading và spinners
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Toast notifications
- **Form Validation**: Real-time validation với error states

## 🔧 API Endpoints

### Course Management
```javascript
GET    /api/courses          // Lấy danh sách khóa học
POST   /api/courses          // Tạo khóa học mới
GET    /api/courses/:id      // Lấy chi tiết khóa học
PUT    /api/courses/:id      // Cập nhật khóa học
DELETE /api/courses/:id      // Xóa khóa học
```

### File Upload
```javascript
POST   /api/upload/video           // Upload video file
GET    /api/videos/:filename       // Stream video file  
GET    /api/upload/my-videos       // Lấy danh sách video của user
DELETE /api/upload/video/:filename // Xóa video file
```

### Authentication
```javascript
POST   /api/auth/login        // Teacher login
GET    /api/auth/me          // Get current user info
```

## 🚀 Getting Started

### 1. Khởi chạy nhanh
```bash
# Windows
./start-teacher-demo.bat

# Manual
cd backend && npm install && node setupTeacherDemo.js && npm start
cd frontend && yarn install && yarn start
```

### 2. Truy cập hệ thống
- **Demo Preview**: http://localhost:3000/#/teacher-preview
- **Teacher Login**: http://localhost:3000/#/login
- **Backend API**: http://localhost:5000

### 3. Demo Account
```
Email: teacher@nextgen.com
Password: Teacher123!
```

## ✨ Highlights

### 🎥 Video Upload System
- **3 phương thức upload**: URL, File upload, Library selection
- **File support**: MP4, AVI, MOV, WMV up to 500MB
- **Smart validation**: File type và size checking
- **Progress tracking**: Upload progress với percentage

### 📊 Smart Dashboard
- **Real-time stats**: Course count, publish status, student metrics
- **Recent activity**: Latest courses với quick actions
- **Visual indicators**: Status badges, progress bars, icons

### 🎨 Modern UI/UX
- **Gradient backgrounds**: Eye-catching visual design
- **Smooth animations**: Hover effects, transitions, loading states  
- **Consistent branding**: NextGen English color scheme
- **Accessibility**: Keyboard navigation, screen reader friendly

---

## 📞 Support

Nếu có bất kỳ vấn đề gì với Teacher UI/UX system, vui lòng liên hệ team phát triển!