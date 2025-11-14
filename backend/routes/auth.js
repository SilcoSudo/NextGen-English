const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin, generateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email hoặc tên đăng nhập không được để trống')
    .isLength({ min: 3 })
    .withMessage('Email hoặc tên đăng nhập phải có ít nhất 3 ký tự'),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
];

const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Họ tên không được để trống')
    .isLength({ min: 2 })
    .withMessage('Họ tên phải có ít nhất 2 ký tự')
    .matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/)
    .withMessage('Họ tên chỉ được chứa chữ cái và khoảng trắng'),
  body('username')
    .notEmpty()
    .withMessage('Tên đăng nhập không được để trống')
    .isLength({ min: 3, max: 20 })
    .withMessage('Tên đăng nhập phải từ 3-20 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
  body('email')
    .isEmail()
    .withMessage('Email không đúng định dạng')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số')
];

const updateProfileValidation = [
  body('name').optional({ nullable: true }),
  body('phone').optional({ nullable: true }),
  body('dateOfBirth').optional({ nullable: true }),
  body('bio').optional({ nullable: true }),
  body('avatar').optional({ nullable: true }),
];

// Routes
/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập người dùng
 * @access  Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký người dùng mới
 * @access  Public
 */
router.post('/register', registerValidation, authController.register);

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin người dùng hiện tại
 * @access  Private
 */
router.get('/me', authenticateToken, authController.getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất người dùng
 * @access  Private
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Làm mới token
 * @access  Private
 */
router.post('/refresh', authenticateToken, authController.refreshToken);

/**
 * @route   PUT /api/auth/profile
 * @desc    Cập nhật thông tin cá nhân
 * @access  Private
 */
router.put('/profile', authenticateToken, authController.updateProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Đổi mật khẩu
 * @access  Private
 */
router.put('/change-password', authenticateToken, authController.changePassword);

/**
 * @route   PUT /api/auth/update-role
 * @desc    Cập nhật role user (tạm thời public để test)
 * @access  Public
 */
router.put('/update-role', authController.updateUserRole);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Xác thực email với token
 * @access  Public
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Gửi lại email xác thực
 * @access  Public
 */
router.post('/resend-verification', authController.resendVerificationEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Yêu cầu đặt lại mật khẩu
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Đặt lại mật khẩu với token
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

// Google OAuth Routes
/**
 * @route   GET /api/auth/google
 * @desc    Redirect to Google login
 * @access  Public
 */
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`,
    session: false
  }),
  (req, res) => {
    try {
      if (!req.user) {
        throw new Error('No user returned from Google OAuth');
      }

      // Generate JWT token
      const token = generateToken(req.user._id);
      const userEmail = req.user.email;
      
      console.log('✅ Google OAuth successful for:', userEmail);
      console.log('🔐 JWT Token generated:', token.substring(0, 20) + '...');
      
      // Redirect to frontend with token in query params
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/#/auth-success?token=${token}`;
      
      console.log('🔄 Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/#/login?error=server_error`);
    }
  }
);

// ADMIN ROUTES - Quản lý người dùng (chỉ admin)

/**
 * @route   GET /api/auth/admin/users
 * @desc    Lấy danh sách tất cả users với phân trang và lọc
 * @access  Admin only
 */
router.get('/admin/users', authenticateToken, requireAdmin, authController.getAllUsers);

/**
 * @route   PUT /api/auth/admin/users/:userId
 * @desc    Cập nhật thông tin user
 * @access  Admin only
 */
router.put('/admin/users/:userId', authenticateToken, requireAdmin, authController.updateUser);

/**
 * @route   DELETE /api/auth/admin/users/:userId
 * @desc    Vô hiệu hóa tài khoản user
 * @access  Admin only
 */
router.delete('/admin/users/:userId', authenticateToken, requireAdmin, authController.deleteUser);

// Test route để kiểm tra API
router.get('/test', (req, res) => {
  res.json({
    message: 'Auth API đang hoạt động',
    endpoints: [
      'POST /api/auth/login - Đăng nhập',
      'POST /api/auth/register - Đăng ký',
      'GET /api/auth/me - Lấy thông tin user',
      'POST /api/auth/logout - Đăng xuất',
      'POST /api/auth/refresh - Làm mới token',
      'PUT /api/auth/profile - Cập nhật thông tin'
    ]
  });
});

module.exports = router;