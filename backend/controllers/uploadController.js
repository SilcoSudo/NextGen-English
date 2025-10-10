const path = require('path');
const fs = require('fs');
const { 
  upload, 
  handleUploadError, 
  moveVideoToFinal, 
  deleteVideoFile, 
  getVideoInfo 
} = require('../middleware/uploadVideo');

// @desc    Upload video file
// @route   POST /api/upload/video
// @access  Private (Teacher/Admin)
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file video được upload',
        error: 'NO_FILE'
      });
    }

    const { file } = req;
    const { originalname, filename, mimetype, size } = file;
    
    // Tạo tên file cuối cùng
    const extension = path.extname(originalname);
    const finalFilename = `${path.basename(filename, path.extname(filename))}${extension}`;
    
    // Di chuyển file từ temp sang thư mục video
    const finalPath = await moveVideoToFinal(file.path, finalFilename);
    
    // Tạo URL để truy cập video
    const videoUrl = `${req.protocol}://${req.get('host')}/api/videos/${finalFilename}`;
    
    res.json({
      success: true,
      message: 'Upload video thành công',
      data: {
        filename: finalFilename,
        originalName: Buffer.from(originalname, 'latin1').toString('utf8'),
        mimetype,
        size,
        url: videoUrl,
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.user.id
      }
    });
  } catch (error) {
    console.error('Upload video error:', error);
    
    // Xóa file temp nếu có lỗi
    if (req.file && req.file.path) {
      try {
        const fs = require('fs-extra');
        await fs.remove(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi upload video',
      error: 'UPLOAD_ERROR'
    });
  }
};

// @desc    Get video file info
// @route   GET /api/upload/video/:filename
// @access  Private (Teacher/Admin)
const getVideoFileInfo = async (req, res) => {
  try {
    const { filename } = req.params;
    
    const videoInfo = await getVideoInfo(filename);
    
    if (!videoInfo) {
      return res.status(404).json({
        success: false,
        message: 'Video không tồn tại',
        error: 'VIDEO_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: videoInfo
    });
  } catch (error) {
    console.error('Get video info error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy thông tin video',
      error: 'GET_INFO_ERROR'
    });
  }
};

// @desc    Delete video file
// @route   DELETE /api/upload/video/:filename
// @access  Private (Teacher/Admin)
const deleteVideo = async (req, res) => {
  try {
    const { filename } = req.params;
    
    const deleted = await deleteVideoFile(filename);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Video không tồn tại',
        error: 'VIDEO_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa video thành công'
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi xóa video',
      error: 'DELETE_ERROR'
    });
  }
};

// @desc    List uploaded videos for teacher
// @route   GET /api/upload/my-videos
// @access  Private (Teacher/Admin)
const getMyVideos = async (req, res) => {
  try {
    const fs = require('fs-extra');
    const { createUploadDir } = require('../middleware/uploadVideo');
    const { videoDir } = await createUploadDir();
    
    // Lấy danh sách tất cả video files
    const files = await fs.readdir(videoDir);
    const videoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp4', '.avi', '.mov', '.webm', '.ogg', '.3gp', '.wmv'].includes(ext);
    });
    
    // Lấy thông tin chi tiết của từng file
    const videoInfos = await Promise.all(
      videoFiles.map(async (filename) => {
        try {
          const info = await getVideoInfo(filename);
          const videoUrl = `${req.protocol}://${req.get('host')}/api/videos/${filename}`;
          
          return {
            ...info,
            url: videoUrl
          };
        } catch (error) {
          console.error(`Error getting info for ${filename}:`, error);
          return null;
        }
      })
    );
    
    // Lọc bỏ các file lỗi và sắp xếp theo ngày tạo
    const validVideos = videoInfos
      .filter(info => info !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      data: validVideos,
      total: validVideos.length
    });
  } catch (error) {
    console.error('Get my videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách video',
      error: 'LIST_ERROR'
    });
  }
};

// @desc    Upload image file  
// @route   POST /api/upload/image
// @access  Private (Teacher/Admin)
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file hình ảnh được upload',
        error: 'NO_FILE'
      });
    }

    const { file } = req;
    const { originalname, filename, mimetype, size } = file;
    
    // Tạo thư mục images nếu chưa có
    const imagesDir = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Tạo tên file cuối cùng
    const extension = path.extname(originalname);
    const finalFilename = `${Date.now()}_${Buffer.from(originalname, 'latin1').toString('utf8').replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // Di chuyển file từ temp sang thư mục images
    const finalPath = path.join(imagesDir, finalFilename);
    fs.renameSync(file.path, finalPath);
    
    // Tạo URL để truy cập image
    const imageUrl = `${req.protocol}://${req.get('host')}/api/images/${finalFilename}`;
    
    res.json({
      success: true,
      message: 'Upload hình ảnh thành công',
      data: {
        filename: finalFilename,
        originalName: Buffer.from(originalname, 'latin1').toString('utf8'),
        mimetype,
        size,
        url: imageUrl,
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.user._id || req.user.id
      }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi upload hình ảnh',
      error: 'UPLOAD_ERROR'
    });
  }
};

module.exports = {
  uploadVideo,
  uploadImage,
  getVideoFileInfo,
  deleteVideo,
  getMyVideos
};