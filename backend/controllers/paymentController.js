const crypto = require('crypto');
const axios = require('axios');
const LessonProgress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// MoMo configuration
const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  returnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:3000/payment/success',
  notifyUrl: process.env.MOMO_NOTIFY_URL || 'http://localhost:5000/api/payment/momo/webhook',
  requestType: 'payWithATM'
};

// Generate signature for MoMo request
const generateSignature = (rawData) => {
  return crypto
    .createHmac('sha256', MOMO_CONFIG.secretKey)
    .update(rawData)
    .digest('hex');
};

// POST /api/payment/momo/create - Tạo payment request với MoMo
const createMoMoPayment = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user._id || req.user.id;

    // Validation
    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: 'Lesson ID không được để trống'
      });
    }

    // Kiểm tra lesson có tồn tại không
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }

    // Kiểm tra lesson đã published chưa
    if (lesson.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Bài học chưa được xuất bản'
      });
    }

    // Kiểm tra lesson có miễn phí không
    if (lesson.price === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bài học này miễn phí, không cần thanh toán'
      });
    }

    // Kiểm tra user đã mua lesson chưa
    const existingProgress = await LessonProgress.findOne({
      userId,
      lessonId: lesson._id
    });

    if (existingProgress && existingProgress.paymentInfo.paid) {
      return res.status(409).json({
        success: false,
        message: 'Bạn đã mua bài học này rồi'
      });
    }

    // Lấy thông tin user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    // Tạo order info
    const orderId = `LESSON_${lessonId}_${userId}_${Date.now()}`;
    const requestId = orderId;
    const amount = Math.round(lesson.price); // Ensure integer
    const orderInfo = `Thanh toán bài học: ${lesson.title}`;
    const extraData = JSON.stringify({
      lessonId: lesson._id.toString(),
      userId: userId.toString(),
      lessonTitle: lesson.title
    });

    // Tạo raw signature data
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_CONFIG.notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.returnUrl}&requestId=${requestId}&requestType=${MOMO_CONFIG.requestType}`;
    
    const signature = generateSignature(rawSignature);

    // MoMo request payload
    const requestBody = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: MOMO_CONFIG.returnUrl,
      ipnUrl: MOMO_CONFIG.notifyUrl,
      requestType: MOMO_CONFIG.requestType,
      extraData: extraData,
      lang: 'vi',
      signature: signature
    };

    console.log('🏦 Creating MoMo payment:', {
      orderId,
      amount,
      lessonTitle: lesson.title,
      user: user.name
    });

    // Gửi request tới MoMo
    const response = await axios.post(MOMO_CONFIG.endpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.data && response.data.resultCode === 0) {
      // Tạo hoặc cập nhật progress với thông tin payment pending
      let progress = existingProgress;
      if (!progress) {
        progress = new LessonProgress({
          userId,
          lessonId: lesson._id,
          status: 'not-started',
          enrolledAt: new Date(),
          totalTime: lesson.duration * 60,
          paymentInfo: {
            paid: false,
            amount: lesson.price,
            paymentMethod: 'momo',
            transactionId: orderId,
            currency: 'VND'
          }
        });
      } else {
        progress.paymentInfo.transactionId = orderId;
        progress.paymentInfo.paymentMethod = 'momo';
      }
      
      await progress.save();

      res.json({
        success: true,
        message: 'Tạo link thanh toán thành công',
        data: {
          payUrl: response.data.payUrl,
          orderId: orderId,
          amount: amount,
          qrCodeUrl: response.data.qrCodeUrl,
          deeplink: response.data.deeplink
        }
      });

    } else {
      console.error('MoMo API Error:', response.data);
      res.status(400).json({
        success: false,
        message: 'Lỗi tạo thanh toán MoMo',
        error: response.data
      });
    }

  } catch (error) {
    console.error('Create MoMo payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo thanh toán',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST /api/payment/momo/webhook - MoMo webhook notification
const handleMoMoWebhook = async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;

    console.log('🔔 MoMo Webhook received:', {
      orderId,
      resultCode,
      message,
      amount,
      transId
    });

    // Verify signature
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const expectedSignature = generateSignature(rawSignature);

    if (signature !== expectedSignature) {
      console.error('❌ Invalid MoMo signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    // Parse extraData để lấy thông tin lesson và user
    let lessonId, userId;
    try {
      const extraDataObj = JSON.parse(extraData);
      lessonId = extraDataObj.lessonId;
      userId = extraDataObj.userId;
    } catch (parseError) {
      console.error('❌ Invalid extraData:', extraData);
      return res.status(400).json({
        success: false,
        message: 'Invalid extraData'
      });
    }

    // Tìm progress record
    const progress = await LessonProgress.findOne({
      userId,
      lessonId,
      'paymentInfo.transactionId': orderId
    });

    if (!progress) {
      console.error('❌ Progress not found for webhook:', { userId, lessonId, orderId });
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }

    // Kiểm tra kết quả thanh toán
    if (resultCode === 0) {
      // Thanh toán thành công
      await progress.processPayment(amount, 'momo', transId);
      
      console.log('✅ Payment successful:', {
        orderId,
        transId,
        userId,
        lessonId,
        amount
      });

      // Cập nhật lesson stats
      const lesson = await Lesson.findById(lessonId);
      if (lesson) {
        await lesson.addEnrollment(amount);
      }

    } else {
      // Thanh toán thất bại
      progress.paymentInfo.paid = false;
      progress.paymentInfo.failureReason = message;
      await progress.save();

      console.log('❌ Payment failed:', {
        orderId,
        resultCode,
        message,
        userId,
        lessonId
      });
    }

    // Trả về response cho MoMo
    res.json({
      partnerCode: partnerCode,
      requestId: requestId,
      orderId: orderId,
      resultCode: 0,
      message: 'success',
      responseTime: Date.now()
    });

  } catch (error) {
    console.error('MoMo webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/payment/status/:orderId - Kiểm tra trạng thái thanh toán
const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id || req.user.id;

    // Tìm progress record
    const progress = await LessonProgress.findOne({
      userId,
      'paymentInfo.transactionId': orderId
    }).populate('lessonId', 'title price');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin thanh toán'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: orderId,
        paid: progress.paymentInfo.paid,
        amount: progress.paymentInfo.amount,
        paymentMethod: progress.paymentInfo.paymentMethod,
        paidAt: progress.paymentInfo.paidAt,
        lesson: progress.lessonId,
        status: progress.status
      }
    });

  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi kiểm tra trạng thái thanh toán'
    });
  }
};

// GET /api/payment/history - Lịch sử thanh toán của user
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const payments = await LessonProgress.find({
      userId,
      'paymentInfo.paid': true
    })
    .populate('lessonId', 'title thumbnail price duration')
    .sort({ 'paymentInfo.paidAt': -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await LessonProgress.countDocuments({
      userId,
      'paymentInfo.paid': true
    });

    res.json({
      success: true,
      data: payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        hasNextPage: skip + payments.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy lịch sử thanh toán'
    });
  }
};

module.exports = {
  createMoMoPayment,
  handleMoMoWebhook,
  checkPaymentStatus,
  getPaymentHistory
};