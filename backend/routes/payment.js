const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createMoMoPayment,
  handleMoMoWebhook,
  checkPaymentStatus,
  getPaymentHistory
} = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Payment validation
const paymentValidation = [
  body('lessonId')
    .notEmpty()
    .withMessage('Lesson ID không được để trống')
    .isMongoId()
    .withMessage('Lesson ID không hợp lệ')
];

/**
 * @route   POST /api/payment/momo/create
 * @desc    Tạo payment request với MoMo
 * @access  Private/Student
 */
router.post('/momo/create', authenticateToken, paymentValidation, createMoMoPayment);

/**
 * @route   POST /api/payment/momo/webhook
 * @desc    MoMo webhook notification (không cần auth)
 * @access  Public (MoMo webhook)
 */
router.post('/momo/webhook', handleMoMoWebhook);

/**
 * @route   GET /api/payment/status/:orderId
 * @desc    Kiểm tra trạng thái thanh toán
 * @access  Private/Student
 */
router.get('/status/:orderId', authenticateToken, checkPaymentStatus);

/**
 * @route   GET /api/payment/history
 * @desc    Lịch sử thanh toán của user
 * @access  Private/Student
 */
router.get('/history', authenticateToken, getPaymentHistory);

// Test route
router.get('/test', (req, res) => {
  res.json({
    message: 'Payment API đang hoạt động',
    endpoints: [
      'POST /api/payment/momo/create - Tạo thanh toán MoMo',
      'POST /api/payment/momo/webhook - MoMo webhook',
      'GET /api/payment/status/:orderId - Kiểm tra trạng thái',
      'GET /api/payment/history - Lịch sử thanh toán'
    ],
    momo: {
      configured: !!(process.env.MOMO_PARTNER_CODE && process.env.MOMO_ACCESS_KEY && process.env.MOMO_SECRET_KEY),
      endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create'
    }
  });
});

module.exports = router;