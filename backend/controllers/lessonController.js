const { validationResult } = require('express-validator');
const Lesson = require('../models/Lesson');
const LessonProgress = require('../models/Progress');
const User = require('../models/User');

// GET /api/lessons - Lấy danh sách bài học (public cho students)
const getLessons = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      level, 
      ageGroup, 
      search, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      priceFilter // 'free', 'paid', 'all'
    } = req.query;

    // Build query for published lessons only
    let query = {
      status: 'published',
      'settings.isActive': true
    };

    // Apply filters
    if (category) query.category = category;
    if (level) query.level = level;
    if (ageGroup) query.ageGroup = ageGroup;
    
    // Price filter
    if (priceFilter === 'free') {
      query.price = 0;
    } else if (priceFilter === 'paid') {
      query.price = { $gt: 0 };
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions,
      populate: {
        path: 'createdBy',
        select: 'name username avatar profile.level'
      }
    };

    const result = await Lesson.paginate(query, options);

    res.json({
      success: true,
      data: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalLessons: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách bài học'
    });
  }
};

// GET /api/lessons/:id - Lấy chi tiết bài học
const getLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findById(id)
      .populate('createdBy', 'name username avatar profile');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }

    // Check if lesson is published (for non-owners)
    const user = req.user;
    const canView = lesson.status === 'published' || 
                   (user && lesson.canEdit(user)) || 
                   (user && user.role === 'admin');

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'Bài học chưa được xuất bản'
      });
    }

    // Add view count
    await lesson.addView();

    // If user is authenticated, get their progress
    let userProgress = null;
    if (user) {
      userProgress = await LessonProgress.findOne({
        userId: user._id || user.id,
        lessonId: lesson._id
      });
    }

    res.json({
      success: true,
      data: {
        lesson,
        userProgress
      }
    });

  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin bài học'
    });
  }
};

// POST /api/lessons - Tạo bài học mới với file upload (Teacher only)
const createLesson = async (req, res) => {
  try {
    console.log('Creating lesson with data:', req.body);
    console.log('Files:', req.files);
    
    // Handle file uploads and create URLs
    let videoUrl = '';
    let thumbnailUrl = '';
    
    if (req.files) {
      const { moveVideoToFinal } = require('../middleware/uploadVideo');
      const path = require('path');
      const fs = require('fs-extra');
      
      // Handle video upload
      if (req.files.video && req.files.video[0]) {
        const videoFile = req.files.video[0];
        const extension = path.extname(videoFile.originalname);
        const finalFilename = `${path.basename(videoFile.filename, path.extname(videoFile.filename))}${extension}`;
        
        try {
          await moveVideoToFinal(videoFile.path, finalFilename);
          videoUrl = `${req.protocol}://${req.get('host')}/api/videos/${finalFilename}`;
        } catch (moveError) {
          console.error('Error moving video file:', moveError);
          return res.status(500).json({
            success: false,
            message: 'Lỗi khi xử lý file video'
          });
        }
      }
      
      // Handle thumbnail upload
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbnailFile = req.files.thumbnail[0];
        const imagesDir = path.join(__dirname, '../uploads/images');
        const finalFilename = `${Date.now()}_${Buffer.from(thumbnailFile.originalname, 'latin1').toString('utf8').replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const finalPath = path.join(imagesDir, finalFilename);
        
        try {
          await fs.ensureDir(imagesDir);
          await fs.move(thumbnailFile.path, finalPath);
          thumbnailUrl = `${req.protocol}://${req.get('host')}/api/images/${finalFilename}`;
        } catch (moveError) {
          console.error('Error moving thumbnail file:', moveError);
          return res.status(500).json({
            success: false,
            message: 'Lỗi khi xử lý file hình ảnh'
          });
        }
      }
    }

    const {
      title,
      description,
      ageGroup,
      duration,
      price,
      minigameUrl,
      status,
      category,
      level,
      objectives,
      prerequisites,
      tags
    } = req.body;

    // Parse JSON arrays
    let parsedObjectives = [];
    let parsedPrerequisites = [];
    let parsedTags = [];
    
    try {
      if (objectives) parsedObjectives = JSON.parse(objectives);
      if (prerequisites) parsedPrerequisites = JSON.parse(prerequisites);
      if (tags) parsedTags = JSON.parse(tags);
    } catch (parseError) {
      console.error('Error parsing arrays:', parseError);
    }

    // Generate slug from title
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .trim()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
        .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
        .replace(/[ìíịỉĩ]/g, 'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
        .replace(/[ùúụủũưừứựửữ]/g, 'u')
        .replace(/[ỳýỵỷỹ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    let slug = generateSlug(title);
    
    // Make sure slug is unique
    let slugCounter = 1;
    let originalSlug = slug;
    while (await Lesson.findOne({ slug })) {
      slug = `${originalSlug}-${slugCounter}`;
      slugCounter++;
    }

    // Create new lesson
    const newLesson = new Lesson({
      title,
      description,
      slug,
      videoUrl,
      thumbnail: thumbnailUrl,
      ageGroup,
      duration: parseInt(duration) || 10,
      price: parseFloat(price) || 0,
      minigameUrl: minigameUrl || null,
      status: status || 'draft',
      category,
      level,
      objectives: parsedObjectives,
      prerequisites: parsedPrerequisites,
      tags: parsedTags,
      createdBy: req.user._id || req.user.id
    });

    await newLesson.save();

    // Populate creator info
    await newLesson.populate('createdBy', 'name username avatar');

    res.status(201).json({
      success: true,
      message: 'Tạo bài học thành công',
      data: newLesson
    });

  } catch (error) {
    console.error('Create lesson error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      const fs = require('fs-extra');
      try {
        if (req.files.video && req.files.video[0]) {
          await fs.remove(req.files.video[0].path);
        }
        if (req.files.thumbnail && req.files.thumbnail[0]) {
          await fs.remove(req.files.thumbnail[0].path);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up files:', cleanupError);
      }
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Tiêu đề bài học đã tồn tại'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo bài học'
    });
  }
};

// PUT /api/lessons/:id - Cập nhật bài học (Teacher owner or Admin)
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }

    // Check permissions
    if (!lesson.canEdit(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền sửa bài học này'
      });
    }

    // Validation (skip for file uploads)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Only check validation if it's not a file upload
      if (!req.files || (!req.files.video && !req.files.thumbnail)) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array()
        });
      }
    }

    // Prepare update data
    const updateData = { ...req.body };
    
    // Handle file uploads
    if (req.files) {
      const { moveVideoToFinal } = require('../middleware/uploadVideo');
      const path = require('path');
      
      // Handle video upload
      if (req.files.video && req.files.video[0]) {
        const videoFile = req.files.video[0];
        const extension = path.extname(videoFile.originalname);
        const finalFilename = `${path.basename(videoFile.filename, path.extname(videoFile.filename))}${extension}`;
        
        try {
          await moveVideoToFinal(videoFile.path, finalFilename);
          updateData.videoUrl = `${req.protocol}://${req.get('host')}/api/videos/${finalFilename}`;
        } catch (moveError) {
          console.error('Error moving video file:', moveError);
          return res.status(500).json({
            success: false,
            message: 'Lỗi khi xử lý file video'
          });
        }
      }
      
      // Handle thumbnail upload
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbnailFile = req.files.thumbnail[0];
        const imagesDir = path.join(__dirname, '../uploads/images');
        const finalFilename = `${Date.now()}_${Buffer.from(thumbnailFile.originalname, 'latin1').toString('utf8').replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const finalPath = path.join(imagesDir, finalFilename);
        
        try {
          const fs = require('fs-extra');
          await fs.ensureDir(imagesDir);
          await fs.move(thumbnailFile.path, finalPath);
          updateData.thumbnail = `${req.protocol}://${req.get('host')}/api/images/${finalFilename}`;
        } catch (moveError) {
          console.error('Error moving thumbnail file:', moveError);
          return res.status(500).json({
            success: false,
            message: 'Lỗi khi xử lý file hình ảnh'
          });
        }
      }
    }
    
    // Don't allow changing createdBy
    delete updateData.createdBy;
    
    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name username avatar');

    res.json({
      success: true,
      message: 'Cập nhật bài học thành công',
      data: updatedLesson
    });

  } catch (error) {
    console.error('Update lesson error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      const fs = require('fs-extra');
      try {
        if (req.files.video && req.files.video[0]) {
          await fs.remove(req.files.video[0].path);
        }
        if (req.files.thumbnail && req.files.thumbnail[0]) {
          await fs.remove(req.files.thumbnail[0].path);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up files:', cleanupError);
      }
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật bài học'
    });
  }
};

// DELETE /api/lessons/:id - Xóa bài học (Teacher owner or Admin)
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }

    // Check permissions
    if (!lesson.canEdit(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa bài học này'
      });
    }

    // Check if lesson has enrollments
    const enrollmentCount = await LessonProgress.countDocuments({ lessonId: id });
    if (enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa bài học đã có ${enrollmentCount} học viên đăng ký. Hãy chuyển sang trạng thái 'archived' thay thế.`
      });
    }

    await Lesson.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Xóa bài học thành công'
    });

  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa bài học'
    });
  }
};

// GET /api/lessons/my-lessons - Lấy danh sách bài học đã mua của student hiện tại
const getMyLessons = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    console.log('Getting purchased lessons for user:', userId);
    
    // Find all progresses for this user
    const progresses = await LessonProgress.find({ userId })
      .populate({
        path: 'lessonId',
        select: 'title description thumbnail videoUrl ageGroup duration price category level status createdBy',
        populate: {
          path: 'createdBy',
          select: 'name username avatar'
        }
      })
      .sort({ enrolledAt: -1 });
    
    console.log('Found progresses:', progresses.length);
    
    // Transform to lesson format with progress info
    const lessons = progresses
      .filter(progress => progress.lessonId) // Only include if lesson still exists
      .map(progress => ({
        _id: progress.lessonId._id,
        title: progress.lessonId.title,
        description: progress.lessonId.description,
        thumbnail: progress.lessonId.thumbnail,
        videoUrl: progress.lessonId.videoUrl,
        ageGroup: progress.lessonId.ageGroup,
        duration: progress.lessonId.duration,
        price: progress.lessonId.price,
        category: progress.lessonId.category,
        level: progress.lessonId.level,
        status: progress.lessonId.status,
        createdBy: progress.lessonId.createdBy,
        // Progress information
        progress: {
          status: progress.status,
          progressPercentage: progress.progressPercentage || 0,
          watchTime: progress.watchTime || 0,
          totalTime: progress.totalTime || progress.lessonId.duration * 60,
          enrolledAt: progress.enrolledAt,
          startedAt: progress.startedAt,
          completedAt: progress.completedAt,
          lastWatchedAt: progress.lastWatchedAt,
          rating: progress.rating,
          paymentInfo: progress.paymentInfo
        }
      }));
    
    res.json({
      success: true,
      data: lessons,
      total: lessons.length
    });

  } catch (error) {
    console.error('Get my lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách bài học'
    });
  }
};

// GET /api/lessons/teacher/my-lessons - Lấy bài học của teacher
const getTeacherLessons = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: {
        path: 'createdBy',
        select: 'name username avatar'
      }
    };

    const result = await Lesson.paginate(
      { createdBy: req.user._id || req.user.id, ...(status && { status }) },
      options
    );

    res.json({
      success: true,
      data: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalLessons: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get teacher lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách bài học'
    });
  }
};

// PUT /api/lessons/:id/status - Cập nhật trạng thái bài học
const updateLessonStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }

    // Check permissions
    if (!lesson.canEdit(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thay đổi trạng thái bài học này'
      });
    }

    lesson.status = status;
    await lesson.save();

    res.json({
      success: true,
      message: `Đã chuyển bài học sang trạng thái ${status}`,
      data: lesson
    });

  } catch (error) {
    console.error('Update lesson status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái'
    });
  }
};

// GET /api/lessons/stats - Thống kê bài học (Admin)
const getLessonStats = async (req, res) => {
  try {
    const stats = await Lesson.aggregate([
      {
        $group: {
          _id: null,
          totalLessons: { $sum: 1 },
          publishedLessons: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          draftLessons: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          freeLessons: {
            $sum: { $cond: [{ $eq: ['$price', 0] }, 1, 0] }
          },
          paidLessons: {
            $sum: { $cond: [{ $gt: ['$price', 0] }, 1, 0] }
          },
          totalViews: { $sum: '$stats.totalViews' },
          totalEnrollments: { $sum: '$stats.totalEnrollments' },
          totalRevenue: {
            $sum: {
              $multiply: ['$stats.totalEnrollments', '$price']
            }
          }
        }
      }
    ]);

    const categoryStats = await Lesson.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const ageGroupStats = await Lesson.aggregate([
      { $group: { _id: '$ageGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        byCategory: categoryStats,
        byAgeGroup: ageGroupStats
      }
    });

  } catch (error) {
    console.error('Get lesson stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê'
    });
  }
};

// POST /api/lessons/enroll - Đăng ký học bài học
const enrollLesson = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user._id || req.user.id;

    // Kiểm tra bài học có tồn tại không
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }

    // Kiểm tra bài học đã được xuất bản chưa
    if (lesson.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Bài học chưa được xuất bản'
      });
    }

    // Kiểm tra user đã đăng ký bài học chưa
    const existingProgress = await LessonProgress.findOne({
      userId,
      lessonId
    });

    if (existingProgress) {
      return res.status(409).json({
        success: false,
        message: 'Bạn đã đăng ký bài học này rồi',
        data: existingProgress
      });
    }

    // Tạo progress mới
    const newProgress = new LessonProgress({
      userId,
      lessonId,
      status: 'not-started',
      enrolledAt: new Date(),
      totalTime: lesson.duration * 60, // Convert minutes to seconds
      paymentInfo: {
        paid: lesson.price === 0 ? true : false, // Free lessons are automatically paid
        amount: lesson.price,
        paymentMethod: lesson.price === 0 ? 'free' : 'pending',
        paidAt: lesson.price === 0 ? new Date() : null
      }
    });

    await newProgress.save();

    // Cập nhật lesson stats
    await lesson.addEnrollment(lesson.price);

    // Populate thông tin cần thiết
    await newProgress.populate([
      { path: 'lessonId', select: 'title thumbnail duration price' },
      { path: 'userId', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: lesson.price === 0 ? 'Đăng ký bài học miễn phí thành công!' : 'Đăng ký bài học thành công!',
      data: newProgress
    });

  } catch (error) {
    console.error('Enroll lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký bài học'
    });
  }
};

// GET /api/lessons/:id/progress - Lấy tiến độ học của user cho bài học
const getLessonProgress = async (req, res) => {
  try {
    const { id: lessonId } = req.params;
    const userId = req.user._id || req.user.id;

    // Kiểm tra bài học có tồn tại không
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }

    // Lấy progress của user cho bài học này
    const progress = await LessonProgress.findOne({
      userId,
      lessonId
    }).populate('lessonId', 'title duration price');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Bạn chưa đăng ký bài học này'
      });
    }

    res.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Get lesson progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy tiến độ học'
    });
  }
};

// PUT /api/lessons/:id/progress - Cập nhật tiến độ xem video
const updateLessonProgress = async (req, res) => {
  try {
    const { id: lessonId } = req.params;
    const userId = req.user._id || req.user.id;
    const { watchTime, totalTime, completed = false } = req.body;

    // Validation
    if (typeof watchTime !== 'number' || watchTime < 0) {
      return res.status(400).json({
        success: false,
        message: 'Thời gian xem không hợp lệ'
      });
    }

    if (typeof totalTime !== 'number' || totalTime <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Tổng thời gian video không hợp lệ'
      });
    }

    // Kiểm tra bài học có tồn tại không
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }

    // Tìm progress của user
    let progress = await LessonProgress.findOne({
      userId,
      lessonId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Bạn chưa đăng ký bài học này'
      });
    }

    // Kiểm tra payment status (nếu bài học không miễn phí)
    if (lesson.price > 0 && !progress.paymentInfo.paid) {
      return res.status(403).json({
        success: false,
        message: 'Bạn cần thanh toán để xem bài học này'
      });
    }

    // Cập nhật progress sử dụng method có sẵn
    if (completed) {
      // Hoàn thành manual
      await progress.completeWatching();
    } else {
      // Cập nhật progress bình thường
      await progress.updateProgress(watchTime, totalTime);
    }

    // Populate lại để trả về thông tin đầy đủ
    await progress.populate('lessonId', 'title duration price');

    res.json({
      success: true,
      message: progress.status === 'completed' ? 'Chúc mừng! Bạn đã hoàn thành bài học!' : 'Cập nhật tiến độ thành công',
      data: progress
    });

  } catch (error) {
    console.error('Update lesson progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật tiến độ'
    });
  }
};

module.exports = {
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
};