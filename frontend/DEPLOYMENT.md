# 🚀 Deploy NextGen English lên GitHub Pages

## 📋 Yêu cầu trước khi deploy

1. **GitHub Repository**: Đảm bảo code đã được push lên GitHub repository `silcosudo/NextGen-English`
2. **GitHub Pages**: Đã bật GitHub Pages trong repository settings
3. **Node.js**: Cài đặt Node.js và npm/yarn

## 🔧 Cấu hình đã hoàn thành

✅ **package.json**: Đã cấu hình `homepage` và scripts deploy
✅ **React Router**: Đã chuyển sang HashRouter cho GitHub Pages
✅ **404.html**: Đã tạo file handle routing
✅ **index.html**: Đã thêm script redirect

## 🚀 Cách deploy

### Phương pháp 1: Sử dụng npm scripts

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies (nếu chưa cài)
npm install

# Deploy
npm run deploy
```

### Phương pháp 2: Sử dụng script deploy

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Chạy script deploy
chmod +x deploy.sh
./deploy.sh
```

### Phương pháp 3: Deploy thủ công

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Build project
npm run build

# Deploy lên GitHub Pages
npx gh-pages -d build
```

## 🌐 URL sau khi deploy

Sau khi deploy thành công, ứng dụng sẽ có sẵn tại:
**https://silcosudo.github.io/NextGen-English/**

## 📝 Lưu ý quan trọng

1. **Thời gian deploy**: Có thể mất 2-5 phút để thay đổi xuất hiện trên GitHub Pages
2. **Branch deploy**: Code sẽ được deploy lên branch `gh-pages`
3. **Routing**: Sử dụng HashRouter (#) thay vì BrowserRouter để tương thích với GitHub Pages
4. **Assets**: Tất cả assets sẽ được serve từ `https://silcosudo.github.io/NextGen-English/`

## 🔍 Kiểm tra deploy

1. Truy cập: https://silcosudo.github.io/NextGen-English/
2. Kiểm tra các tính năng chính:
   - ✅ Trang chủ
   - ✅ Đăng nhập (admin/admin123)
   - ✅ Dashboard admin
   - ✅ Quản lý khóa học
   - ✅ Phân tích doanh thu

## 🛠️ Troubleshooting

### Lỗi 404 khi refresh trang
- Đã được fix bằng HashRouter và 404.html

### Assets không load
- Kiểm tra `homepage` trong package.json
- Đảm bảo sử dụng `%PUBLIC_URL%` trong index.html

### Deploy không thành công
- Kiểm tra quyền write vào repository
- Đảm bảo đã cài đặt `gh-pages` package
- Kiểm tra GitHub Pages settings trong repository

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. GitHub Actions logs (nếu có)
2. Console errors trong browser
3. Network tab để kiểm tra assets loading 