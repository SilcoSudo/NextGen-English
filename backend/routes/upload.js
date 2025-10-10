const express = require('express');
const router = express.Router();
const {
  uploadVideo,
  uploadImage,
  getVideoFileInfo,
  deleteVideo,
  getMyVideos
} = require('../controllers/uploadController');
const { authenticateToken } = require('../middleware/auth');
const teacherAuth = require('../middleware/teacherAuth');
const { upload, handleUploadError } = require('../middleware/uploadVideo');
const { uploadImage: uploadImg, handleImageUploadError } = require('../middleware/uploadImage');

// @route   POST /api/upload/video
// @desc    Upload video file
// @access  Private (Teacher/Admin)
router.post('/video', 
  authenticateToken, 
  teacherAuth,
  upload.single('video'),
  handleUploadError,
  uploadVideo
);

// @route   POST /api/upload/image
// @desc    Upload image file
// @access  Private (Teacher/Admin)
router.post('/image', 
  authenticateToken, 
  teacherAuth,
  uploadImg.single('image'),
  handleImageUploadError,
  uploadImage
);

// @route   GET /api/upload/my-videos
// @desc    Get teacher's uploaded videos
// @access  Private (Teacher/Admin)
router.get('/my-videos', 
  authenticateToken, 
  teacherAuth, 
  getMyVideos
);

// @route   GET /api/upload/video/:filename
// @desc    Get video file info
// @access  Private (Teacher/Admin)
router.get('/video/:filename', 
  authenticateToken, 
  teacherAuth, 
  getVideoFileInfo
);

// @route   DELETE /api/upload/video/:filename
// @desc    Delete video file
// @access  Private (Teacher/Admin)
router.delete('/video/:filename', 
  authenticateToken, 
  teacherAuth, 
  deleteVideo
);

module.exports = router;