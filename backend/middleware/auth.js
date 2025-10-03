const jwt = require('jsonwebtoken');
const User = require('../models/UserMongoDB');

// Middleware xác thực JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Không có token',
        message: 'Vui lòng đăng nhập để truy cập tài nguyên này'
      });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tìm user từ token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Token không hợp lệ',
        message: 'Người dùng không tồn tại'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Tài khoản bị khóa',
        message: 'Tài khoản của bạn đã bị vô hiệu hóa'
      });
    }

    // Thêm thông tin user vào request (toJSON sẽ tự động loại bỏ password)
    req.user = user.toJSON();
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token hết hạn',
        message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token không hợp lệ',
        message: 'Token xác thực không đúng định dạng'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Lỗi máy chủ',
      message: 'Có lỗi xảy ra khi xác thực'
    });
  }
};

// Middleware kiểm tra quyền admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Chưa xác thực',
      message: 'Vui lòng đăng nhập trước'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Không có quyền truy cập',
      message: 'Chỉ admin mới có thể thực hiện hành động này'
    });
  }

  next();
};

// Middleware kiểm tra quyền student hoặc admin
const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Chưa xác thực',
      message: 'Vui lòng đăng nhập trước'
    });
  }

  if (!['student', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      error: 'Không có quyền truy cập',
      message: 'Cần quyền học sinh để truy cập tài nguyên này'
    });
  }

  next();
};

// Middleware tùy chọn - không bắt buộc phải đăng nhập
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user.toJSON();
      }
    }
    
    next();
  } catch (error) {
    // Nếu có lỗi với token, vẫn tiếp tục nhưng không set user
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireStudent,
  optionalAuth
};