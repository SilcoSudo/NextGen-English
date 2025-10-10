const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục upload nếu chưa có
const uploadDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter cho hình ảnh
const imageFilter = (req, file, cb) => {
  // Kiểm tra MIME type
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file hình ảnh định dạng JPG, PNG, WebP'), false);
  }
};

// Cấu hình multer cho upload image
const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: imageFilter
});

// Error handler cho multer
const handleImageUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File hình ảnh quá lớn (tối đa 5MB)',
        error: 'FILE_TOO_LARGE'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ được upload 1 file hình ảnh',
        error: 'TOO_MANY_FILES'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Field name không hợp lệ',
        error: 'INVALID_FIELD_NAME'
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: 'UPLOAD_ERROR'
    });
  }
  
  next(error);
};

// Function to move image from temp to final directory
const moveImageToFinal = async (tempFilePath, finalFilename) => {
  try {
    const finalDir = path.join(__dirname, '../uploads/images');
    
    // Create images directory if it doesn't exist
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }
    
    const finalPath = path.join(finalDir, finalFilename);
    
    // Move file from temp to final location
    fs.renameSync(tempFilePath, finalPath);
    
    return finalPath;
  } catch (error) {
    console.error('Error moving image file:', error);
    throw error;
  }
};

module.exports = {
  uploadImage,
  handleImageUploadError,
  moveImageToFinal
};