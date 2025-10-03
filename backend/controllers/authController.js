const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/UserMongoDB');

// Tạo JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Đăng nhập
const login = async (req, res) => {
  try {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Tìm user theo email hoặc username
    const user = await User.findByEmailOrUsername(email);
    if (!user) {
      return res.status(401).json({
        error: 'Thông tin đăng nhập không đúng',
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Tài khoản bị khóa',
        message: 'Tài khoản của bạn đã bị vô hiệu hóa'
      });
    }

    // Xác thực mật khẩu
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Thông tin đăng nhập không đúng',
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Cập nhật thông tin đăng nhập
    await user.updateLoginInfo();

    // Tạo token
    const token = generateToken(user._id);

    // Trả về thông tin user (toJSON sẽ tự động loại bỏ password)
    const safeUser = user.toJSON();

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: safeUser
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Lỗi máy chủ',
      message: 'Có lỗi xảy ra khi đăng nhập'
    });
  }
};

// Đăng ký
const register = async (req, res) => {
  try {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        details: errors.array()
      });
    }

    const { name, username, email, password } = req.body;

    // Tạo user mới
    const newUser = new User({
      name,
      username,
      email,
      password,
      role: 'student' // Mặc định là student
    });

    await newUser.save();

    // Tạo token
    const token = generateToken(newUser._id);

    // Trả về thông tin user (toJSON sẽ tự động loại bỏ password)
    const safeUser = newUser.toJSON();

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: safeUser
    });

  } catch (error) {
    console.error('Register error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'email' ? 'Email đã được sử dụng' : 'Tên đăng nhập đã được sử dụng';
      return res.status(409).json({
        error: message,
        message: 'Vui lòng chọn email hoặc tên đăng nhập khác'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      error: 'Lỗi máy chủ',
      message: 'Có lỗi xảy ra khi đăng ký'
    });
  }
};

// Lấy thông tin user hiện tại
const getMe = async (req, res) => {
  try {
    // req.user đã được set bởi authenticateToken middleware
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      error: 'Lỗi máy chủ',
      message: 'Có lỗi xảy ra khi lấy thông tin người dùng'
    });
  }
};

// Đăng xuất (client-side sẽ xóa token)
const logout = async (req, res) => {
  try {
    // Với JWT, việc đăng xuất chủ yếu là xóa token ở client
    // Trong thực tế có thể implement blacklist token
    res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Lỗi máy chủ',
      message: 'Có lỗi xảy ra khi đăng xuất'
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    // req.user đã được set bởi authenticateToken middleware
    const newToken = generateToken(req.user.id);

    res.json({
      success: true,
      message: 'Làm mới token thành công',
      token: newToken,
      user: req.user
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      error: 'Lỗi máy chủ',
      message: 'Có lỗi xảy ra khi làm mới token'
    });
  }
};

// Cập nhật thông tin user
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        details: errors.array()
      });
    }

    const { name, avatar } = req.body;
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: 'Không tìm thấy người dùng',
        message: 'Người dùng không tồn tại'
      });
    }

    const safeUser = updatedUser.toJSON();

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: safeUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Lỗi máy chủ',
      message: 'Có lỗi xảy ra khi cập nhật thông tin'
    });
  }
};

// Cập nhật role user (chỉ admin)
const updateUserRole = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        error: 'Thiếu thông tin',
        message: 'Email và role là bắt buộc'
      });
    }

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({
        error: 'Role không hợp lệ',
        message: 'Role phải là student, teacher hoặc admin'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: 'Không tìm thấy user',
        message: 'Email không tồn tại'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `Đã cập nhật role thành ${role}`,
      data: {
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      error: 'Lỗi máy chủ',
      message: 'Có lỗi xảy ra khi cập nhật role'
    });
  }
};

module.exports = {
  login,
  register,
  getMe,
  logout,
  refreshToken,
  updateProfile,
  updateUserRole
};