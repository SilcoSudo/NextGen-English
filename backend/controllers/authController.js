const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

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

    // Generate email verification token
    const verificationToken = newUser.generateEmailVerificationToken();
    
    await newUser.save();

    // Gửi email xác thực
    const emailResult = await sendVerificationEmail(email, verificationToken, name);
    
    if (!emailResult.success) {
      console.warn('Email verification failed to send:', emailResult.error);
    }

    // Tạo token
    const token = generateToken(newUser._id);

    // Trả về thông tin user (toJSON sẽ tự động loại bỏ password)
    const safeUser = newUser.toJSON();

    res.status(201).json({
      success: true,
      message: emailResult.success ? 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.' : 'Đăng ký thành công! Tuy nhiên không thể gửi email xác thực.',
      token,
      user: safeUser,
      emailSent: emailResult.success
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

// Xác thực email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token xác thực là bắt buộc'
      });
    }

    // Tìm user với token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token xác thực không hợp lệ hoặc đã hết hạn'
      });
    }

    // Xác thực email
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    
    await user.save();

    res.json({
      success: true,
      message: 'Xác thực email thành công!'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xác thực email'
    });
  }
};

// Gửi lại email xác thực
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản với email này'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được xác thực'
      });
    }

    // Generate new token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send email
    const emailResult = await sendVerificationEmail(email, verificationToken, user.name);
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Email xác thực đã được gửi lại'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Không thể gửi email xác thực'
      });
    }

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi gửi lại email xác thực'
    });
  }
};

// Yêu cầu reset password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Không tiết lộ user có tồn tại hay không vì lý do bảo mật
      return res.json({
        success: true,
        message: 'Nếu email tồn tại, bạn sẽ nhận được email đặt lại mật khẩu'
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send email
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);
    
    res.json({
      success: true,
      message: 'Nếu email tồn tại, bạn sẽ nhận được email đặt lại mật khẩu',
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xử lý yêu cầu đặt lại mật khẩu'
    });
  }
};

// Reset password với token
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token và mật khẩu mới là bắt buộc'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Tìm user với token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    
    await user.save();

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công!'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đặt lại mật khẩu'
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
  updateUserRole,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword
};