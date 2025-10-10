const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  getTeacherLessons,
  getMyLessons,
  updateLessonStatus,
  getLessonStats,
  enrollLesson,
  getLessonProgress,
  updateLessonProgress
} = require('../controllers/lessonController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const teacherAuth = require('../middleware/teacherAuth');
const { upload, handleUploadError } = require('../middleware/uploadVideo');
const { uploadImage, handleImageUploadError } = require('../middleware/uploadImage');

// Lesson validation rules - Flexible for draft lessons
const lessonValidation = [
  body('title')
    .notEmpty()
    .withMessage('Tiêu đề bài học không được để trống')
    .isLength({ min: 3, max: 100 })
    .withMessage('Tiêu đề phải từ 3-100 ký tự'),
  body('description')
    .notEmpty()
    .withMessage('Mô tả bài học không được để trống')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mô tả phải từ 10-1000 ký tự'),
  body('videoUrl')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value, { req }) => {
      // Only require videoUrl if status is published
      if (req.body.status === 'published' && !value) {
        throw new Error('Video bài học không được để trống khi xuất bản');
      }
      if (value && !/^https?:\/\/.+/.test(value)) {
        throw new Error('Video URL không hợp lệ');
      }
      return true;
    }),
  body('thumbnail')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value, { req }) => {
      // Only require thumbnail if status is published
      if (req.body.status === 'published' && !value) {
        throw new Error('Hình ảnh bài học không được để trống khi xuất bản');
      }
      if (value && !/^https?:\/\/.+/.test(value)) {
        throw new Error('Thumbnail URL không hợp lệ');
      }
      return true;
    }),
  body('ageGroup')
    .isIn(['6-8', '8-10'])
    .withMessage('Độ tuổi phải là 6-8 hoặc 8-10'),
  body('duration')
    .custom((value) => {
      const num = parseInt(value);
      if (isNaN(num) || num < 1 || num > 180) {
        throw new Error('Thời lượng phải từ 1-180 phút');
      }
      return true;
    }),
  body('price')
    .custom((value) => {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        throw new Error('Giá phải là số không âm');
      }
      return true;
    }),
  body('category')
    .isIn(['speaking', 'listening', 'reading', 'writing', 'vocabulary', 'grammar', 'pronunciation'])
    .withMessage('Danh mục không hợp lệ'),
  body('level')
    .isIn(['beginner', 'elementary', 'intermediate', 'advanced'])
    .withMessage('Cấp độ không hợp lệ'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái phải là draft, published hoặc archived'),
  body('minigameUrl')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value) return true;
      if (!/^https?:\/\/.+/.test(value)) {
        throw new Error('URL minigame không hợp lệ');
      }
      return true;
    }),
  body('objectives')
    .optional()
    .isArray()
    .withMessage('Mục tiêu học tập phải là mảng'),
  body('prerequisites')
    .optional()
    .isArray()
    .withMessage('Yêu cầu tiền đề phải là mảng'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags phải là mảng')
];

// Update validation (less strict) - Skip URL validation when files are uploaded
const lessonUpdateValidation = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Tiêu đề phải từ 3-100 ký tự'),
  body('description')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mô tả phải từ 10-1000 ký tự'),
  body('videoUrl')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value, { req }) => {
      // Skip validation if video file is uploaded
      if (req.files && req.files.video) {
        return true;
      }
      // If no file and no URL, it's ok for update
      if (!value) {
        return true;
      }
      // If value exists, it must be a valid URL
      if (!/^https?:\/\/.+/.test(value)) {
        throw new Error('Video URL không hợp lệ');
      }
      return true;
    }),
  body('thumbnail')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value, { req }) => {
      // Skip validation if thumbnail file is uploaded
      if (req.files && req.files.thumbnail) {
        return true;
      }
      // If no file and no URL, it's ok for update
      if (!value) {
        return true;
      }
      // If value exists, it must be a valid URL
      if (!/^https?:\/\/.+/.test(value)) {
        throw new Error('Thumbnail URL không hợp lệ');
      }
      return true;
    }),
  body('ageGroup')
    .optional()
    .isIn(['6-8', '8-10'])
    .withMessage('Độ tuổi phải là 6-8 hoặc 8-10'),
  body('duration')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true; // Allow empty for update
      }
      const num = parseInt(value);
      if (isNaN(num) || num < 1 || num > 180) {
        throw new Error('Thời lượng phải từ 1-180 phút');
      }
      return true;
    }),
  body('price')
    .optional()
    .custom((value) => {
      if (value === '' || value === null || value === undefined) {
        return true; // Allow empty for update
      }
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        throw new Error('Giá phải là số không âm');
      }
      return true;
    }),
  body('category')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['speaking', 'listening', 'reading', 'writing', 'vocabulary', 'grammar', 'pronunciation'])
    .withMessage('Danh mục không hợp lệ'),
  body('level')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['beginner', 'elementary', 'intermediate', 'advanced'])
    .withMessage('Cấp độ không hợp lệ'),
  body('status')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái phải là draft, published hoặc archived'),
  body('minigameUrl')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value) return true; // Allow empty
      if (!/^https?:\/\/.+/.test(value)) {
        throw new Error('URL minigame không hợp lệ');
      }
      return true;
    })
];

// Public routes
/**
 * @route   GET /api/lessons
 * @desc    Lấy danh sách bài học đã xuất bản
 * @access  Public
 */
router.get('/', optionalAuth, getLessons);

/**
 * @route   GET /api/lessons/stats
 * @desc    Thống kê bài học (Admin only)
 * @access  Private/Admin
 */
router.get('/stats', authenticateToken, requireAdmin, getLessonStats);

/**
 * @route   GET /api/lessons/my-lessons
 * @desc    Lấy danh sách bài học đã mua của student hiện tại
 * @access  Private/Student
 */
router.get('/my-lessons', authenticateToken, getMyLessons);

/**
 * @route   GET /api/lessons/teacher/my-lessons
 * @desc    Lấy danh sách bài học của teacher hiện tại
 * @access  Private/Teacher
 */
router.get('/teacher/my-lessons', authenticateToken, teacherAuth, getTeacherLessons);

/**
 * @route   POST /api/lessons
 * @desc    Tạo bài học mới (với file upload)
 * @access  Private/Teacher
 */
router.post('/', 
  authenticateToken, 
  teacherAuth,
  (req, res, next) => {
    // Configure multer for handling both video and thumbnail uploads
    const multer = require('multer');
    const path = require('path');
    
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const tempDir = path.join(__dirname, '../uploads/temp');
        cb(null, tempDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });
    
    const fileFilter = (req, file, cb) => {
      if (file.fieldname === 'video') {
        const allowedMimeTypes = [
          'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
          'video/webm', 'video/ogg', 'video/3gpp', 'video/x-ms-wmv'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Chỉ chấp nhận file video'), false);
        }
      } else if (file.fieldname === 'thumbnail') {
        const allowedMimeTypes = [
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Chỉ chấp nhận file hình ảnh'), false);
        }
      } else {
        cb(new Error('Field không hợp lệ'), false);
      }
    };
    
    const uploadFiles = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 500 * 1024 * 1024, // 500MB for video
        files: 2 // max 2 files
      }
    }).fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]);
    
    uploadFiles(req, res, (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'Lỗi upload file',
          error: 'UPLOAD_ERROR'
        });
      }
      next();
    });
  },
  // Skip validation for file uploads
  createLesson
);

/**
 * @route   POST /api/lessons/enroll
 * @desc    Đăng ký học bài học
 * @access  Private/Student
 */
router.post('/enroll', authenticateToken, enrollLesson);

/**
 * @route   GET /api/lessons/:id/progress
 * @desc    Lấy tiến độ học của user cho bài học
 * @access  Private/Student
 */
router.get('/:id/progress', authenticateToken, getLessonProgress);

/**
 * @route   PUT /api/lessons/:id/progress
 * @desc    Cập nhật tiến độ xem video
 * @access  Private/Student
 */
router.put('/:id/progress', authenticateToken, updateLessonProgress);

/**
 * @route   PUT /api/lessons/:id/status
 * @desc    Cập nhật trạng thái bài học
 * @access  Private/Teacher/Admin
 */
router.put('/:id/status', authenticateToken, teacherAuth, updateLessonStatus);

/**
 * @route   PUT /api/lessons/:id
 * @desc    Cập nhật bài học (có thể bao gồm file upload)
 * @access  Private/Teacher/Admin
 */
router.put('/:id', 
  authenticateToken, 
  teacherAuth,
  (req, res, next) => {
    // Configure multer for handling both video and thumbnail uploads
    const multer = require('multer');
    const path = require('path');
    
    // Use disk storage for temporary handling
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const tempDir = path.join(__dirname, '../uploads/temp');
        cb(null, tempDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });
    
    const fileFilter = (req, file, cb) => {
      if (file.fieldname === 'video') {
        const allowedMimeTypes = [
          'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
          'video/webm', 'video/ogg', 'video/3gpp', 'video/x-ms-wmv'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Chỉ chấp nhận file video'), false);
        }
      } else if (file.fieldname === 'thumbnail') {
        const allowedMimeTypes = [
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Chỉ chấp nhận file hình ảnh'), false);
        }
      } else {
        cb(new Error('Field không hợp lệ'), false);
      }
    };
    
    const uploadFiles = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 500 * 1024 * 1024, // 500MB for video
        files: 2 // max 2 files
      }
    }).fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]);
    
    uploadFiles(req, res, (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'Lỗi upload file',
          error: 'UPLOAD_ERROR'
        });
      }
      next();
    });
  },
  // Only apply validation if there are no files uploaded
  (req, res, next) => {
    // Skip validation for file uploads
    if (req.files && (req.files.video || req.files.thumbnail)) {
      return next();
    }
    // Apply validation for non-file updates
    return lessonUpdateValidation.reduce((promise, validation) => {
      return promise.then(() => validation(req, res, () => {}));
    }, Promise.resolve()).then(() => next()).catch(next);
  },
  updateLesson
);

/**
 * @route   DELETE /api/lessons/:id
 * @desc    Xóa bài học
 * @access  Private/Teacher/Admin
 */
router.delete('/:id', authenticateToken, teacherAuth, deleteLesson);

/**
 * @route   GET /api/lessons/:id
 * @desc    Lấy chi tiết bài học
 * @access  Public (nhưng chỉ hiện published lessons cho non-owners)
 */
router.get('/:id', optionalAuth, getLesson);

// Test route
router.get('/test/api', (req, res) => {
  res.json({
    message: 'Lesson API đang hoạt động',
    endpoints: [
      'GET /api/lessons - Danh sách bài học',
      'GET /api/lessons/:id - Chi tiết bài học',
      'POST /api/lessons - Tạo bài học mới (Teacher)',
      'PUT /api/lessons/:id - Cập nhật bài học (Teacher/Admin)',
      'DELETE /api/lessons/:id - Xóa bài học (Teacher/Admin)',
      'GET /api/lessons/my-lessons - Bài học đã mua (Student)',
      'GET /api/lessons/teacher/my-lessons - Bài học của tôi (Teacher)',
      'PUT /api/lessons/:id/status - Cập nhật trạng thái (Teacher/Admin)',
      'GET /api/lessons/stats - Thống kê (Admin)'
    ]
  });
});

module.exports = router;