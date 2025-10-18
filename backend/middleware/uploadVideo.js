const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Tạo thư mục uploads nếu chưa tồn tại
const createUploadDir = async () => {
  const uploadDir = path.join(__dirname, '../uploads');
  const videoDir = path.join(uploadDir, 'videos');
  const tempDir = path.join(uploadDir, 'temp');
  
  await fs.ensureDir(uploadDir);
  await fs.ensureDir(videoDir);
  await fs.ensureDir(tempDir);
  
  return { uploadDir, videoDir, tempDir };
};

// Khởi tạo thư mục khi module được load
createUploadDir().catch(console.error);

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { tempDir } = await createUploadDir();
      cb(null, tempDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique với timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const extension = path.extname(originalName);
    const basename = path.basename(originalName, extension);
    
    // Làm sạch tên file
    const cleanBasename = basename
      .replace(/[^a-zA-Z0-9\u00C0-\u017F\u1EA0-\u1EF9\s-]/g, '') // Chỉ giữ chữ cái, số, dấu tiếng Việt
      .replace(/\s+/g, '-') // Thay space bằng dash
      .toLowerCase();
    
    const filename = `${cleanBasename}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// File filter - chỉ cho phép video files
const fileFilter = (req, file, cb) => {
  // Kiểm tra MIME type
  const allowedMimeTypes = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/webm',
    'video/ogg',
    'video/3gpp', // .3gp
    'video/x-ms-wmv', // .wmv
    'video/x-matroska', // .mkv
    'video/x-flv', // .flv
    'video/x-ms-asf', // .asf
    'video/x-m4v', // .m4v
    'video/vnd.dlna.mpeg-tts', // .m2ts
    'video/MP2T', // .ts
    'video/x-msvideo', // .avi (duplicate but safe)
    'video/quicktime', // .mov (duplicate but safe)
  ];

  // Kiểm tra extension file nếu MIME type không rõ ràng
  const allowedExtensions = [
    '.mp4', '.avi', '.mov', '.webm', '.ogg', '.3gp', '.wmv',
    '.mkv', '.flv', '.asf', '.m4v', '.m2ts', '.ts', '.mpg', '.mpeg'
  ];

  const fileExt = path.extname(file.originalname).toLowerCase();

  // Cho phép nếu MIME type hợp lệ HOẶC extension hợp lệ
  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    const error = new Error(`Chỉ chấp nhận file video. Định dạng được hỗ trợ: MP4, AVI, MOV, WebM, OGG, 3GP, WMV, MKV, FLV, ASF, M4V, M2TS, TS, MPG, MPEG. File của bạn: ${file.originalname} (${file.mimetype})`);
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

// Cấu hình multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
    files: 1 // Chỉ cho phép 1 file
  }
});

// Middleware xử lý lỗi upload
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File quá lớn. Kích thước tối đa là 500MB',
          error: 'FILE_TOO_LARGE'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Chỉ được upload 1 file video',
          error: 'TOO_MANY_FILES'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Field name không đúng. Sử dụng "video"',
          error: 'UNEXPECTED_FIELD'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Lỗi upload file',
          error: error.code
        });
    }
  }
  
  if (error.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: 'INVALID_FILE_TYPE'
    });
  }
  
  next(error);
};

// Hàm di chuyển file từ temp sang thư mục chính thức
const moveVideoToFinal = async (tempFilePath, finalFilename) => {
  try {
    const { videoDir } = await createUploadDir();
    const finalPath = path.join(videoDir, finalFilename);
    
    await fs.move(tempFilePath, finalPath);
    return finalPath;
  } catch (error) {
    console.error('Error moving video file:', error);
    throw error;
  }
};

// Hàm xóa file
const deleteVideoFile = async (filename) => {
  try {
    const { videoDir } = await createUploadDir();
    const filePath = path.join(videoDir, filename);
    
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting video file:', error);
    throw error;
  }
};

// Hàm lấy thông tin file
const getVideoInfo = async (filename) => {
  try {
    const { videoDir } = await createUploadDir();
    const filePath = path.join(videoDir, filename);
    
    if (await fs.pathExists(filePath)) {
      const stats = await fs.stat(filePath);
      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        path: filePath
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting video info:', error);
    throw error;
  }
};

module.exports = {
  upload,
  handleUploadError,
  moveVideoToFinal,
  deleteVideoFile,
  getVideoInfo,
  createUploadDir
};