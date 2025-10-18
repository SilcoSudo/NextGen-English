// GET /api/analytics/streak - Get current user's learning streak
const getUserStreak = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const user = await User.findById(userId).select('stats');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Calculate if streak is still active (check if last activity was yesterday or today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let currentStreak = user.stats.currentStreak || 0;
    const lastActiveDate = user.stats.lastActiveDate ? new Date(user.stats.lastActiveDate) : null;
    
    if (lastActiveDate) {
      lastActiveDate.setHours(0, 0, 0, 0);
      
      // If last activity was more than 1 day ago, streak is broken
      const daysSinceLastActivity = Math.floor((today - lastActiveDate) / (1000 * 60 * 60 * 24));
      if (daysSinceLastActivity > 1) {
        currentStreak = 0;
        // Optionally update the database, but for now just return 0
      }
    }
    
    res.json({
      success: true,
      data: {
        currentStreak,
        longestStreak: user.stats.longestStreak || 0,
        lastActiveDate: user.stats.lastActiveDate
      }
    });
    
  } catch (error) {
    console.error('Streak fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy streak'
    });
  }
};

// GET /api/analytics/teacher/:teacherId - Thống kê cho giáo viên
const getTeacherAnalytics = async (req, res) => {
  try {
    const teacherId = req.params.teacherId || req.user._id || req.user.id;
    
    // Lấy tất cả lessons của teacher
    const teacherLessons = await Lesson.find({ createdBy: teacherId });
    const lessonIds = teacherLessons.map(lesson => lesson._id);
    
    if (lessonIds.length === 0) {
      return res.json({
        success: true,
        data: {
          overview: {
            totalLessons: 0,
            publishedLessons: 0,
            totalStudents: 0,
            totalRevenue: 0,
            totalViews: 0,
            averageRating: 0
          },
          revenueChart: [],
          lessonPerformance: [],
          studentActivity: []
        }
      });
    }
    
    // Lấy tất cả progress của các lessons này
    const progresses = await LessonProgress.find({ 
      lessonId: { $in: lessonIds } 
    }).populate('userId', 'name email createdAt')
      .populate('lessonId', 'title price');
    
    // Tính overview stats
    const overview = {
      totalLessons: teacherLessons.length,
      publishedLessons: teacherLessons.filter(l => l.status === 'published').length,
      totalStudents: new Set(progresses.map(p => p.userId._id.toString())).size,
      totalRevenue: progresses.reduce((sum, p) => sum + (p.paymentInfo.amount || 0), 0),
      totalViews: teacherLessons.reduce((sum, l) => sum + (l.stats.totalViews || 0), 0),
      averageRating: teacherLessons.reduce((sum, l) => sum + (l.stats.averageRating || 0), 0) / teacherLessons.length || 0
    };
    
    // Revenue chart (last 30 days)
    const revenueChart = await generateRevenueChart(lessonIds, 30);
    
    // Lesson performance
    const lessonPerformance = teacherLessons.map(lesson => {
      const lessonProgresses = progresses.filter(p => p.lessonId._id.toString() === lesson._id.toString());
      const completedCount = lessonProgresses.filter(p => p.status === 'completed').length;
      
      return {
        id: lesson._id,
        title: lesson.title,
        totalPurchases: lessonProgresses.length,
        completedCount,
        completionRate: lessonProgresses.length > 0 ? Math.round((completedCount / lessonProgresses.length) * 100) : 0,
        revenue: lessonProgresses.reduce((sum, p) => sum + (p.paymentInfo.amount || 0), 0),
        averageRating: lesson.stats.averageRating || 0,
        views: lesson.stats.totalViews || 0,
        price: lesson.price
      };
    });
    
    // Student activity (recent enrollments)
    const studentActivity = progresses
      .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
      .slice(0, 10)
      .map(p => ({
        studentName: p.userId.name,
        studentEmail: p.userId.email,
        lessonTitle: p.lessonId.title,
        enrolledAt: p.enrolledAt,
        status: p.status,
        amount: p.paymentInfo.amount || 0
      }));
    
    res.json({
      success: true,
      data: {
        overview,
        revenueChart,
        lessonPerformance,
        studentActivity
      }
    });
    
  } catch (error) {
    console.error('Teacher analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê giáo viên'
    });
  }
};

// GET /api/analytics/admin - Thống kê tổng quát cho admin
const getAdminAnalytics = async (req, res) => {
  try {
    // Tổng quan hệ thống
    const [totalUsers, totalLessons, totalProgresses] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Lesson.countDocuments(),
      LessonProgress.countDocuments()
    ]);
    
    const publishedLessons = await Lesson.countDocuments({ status: 'published' });
    const totalRevenue = await LessonProgress.aggregate([
      { $group: { _id: null, total: { $sum: '$paymentInfo.amount' } } }
    ]);
    
    // User statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Lesson category stats
    const categoryStats = await Lesson.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$stats.totalRevenue' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Monthly revenue (last 12 months)
    const monthlyRevenue = await generateMonthlyRevenue(12);
    
    // Top performing lessons
    const topLessons = await Lesson.find({ status: 'published' })
      .sort({ 'stats.totalPurchases': -1 })
      .limit(10)
      .populate('createdBy', 'name')
      .select('title stats price createdBy');
    
    // Recent activities
    const recentActivities = await LessonProgress.find()
      .sort({ enrolledAt: -1 })
      .limit(20)
      .populate('userId', 'name email')
      .populate('lessonId', 'title price')
      .select('userId lessonId enrolledAt status paymentInfo');
    
    const overview = {
      totalUsers,
      totalLessons,
      publishedLessons,
      totalEnrollments: totalProgresses,
      totalRevenue: totalRevenue[0]?.total || 0,
      averageRevenuePerLesson: totalLessons > 0 ? (totalRevenue[0]?.total || 0) / totalLessons : 0
    };
    
    res.json({
      success: true,
      data: {
        overview,
        userStats,
        categoryStats,
        monthlyRevenue,
        topLessons,
        recentActivities: recentActivities.map(activity => ({
          userName: activity.userId.name,
          userEmail: activity.userId.email,
          lessonTitle: activity.lessonId.title,
          amount: activity.paymentInfo.amount || 0,
          status: activity.status,
          enrolledAt: activity.enrolledAt
        }))
      }
    });
    
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê admin'
    });
  }
};

// GET /api/analytics/student/:studentId - Thống kê cho học sinh
const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id || req.user.id;
    
    // Lấy thông tin user
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học sinh'
      });
    }
    
    // Lấy tất cả progress của user
    const progresses = await LessonProgress.find({ userId: studentId })
      .populate('lessonId', 'title category level duration price')
      .sort({ enrolledAt: -1 });
    
    // Tính toán statistics
    const totalLessons = progresses.length;
    const completedLessons = progresses.filter(p => p.status === 'completed').length;
    const inProgressLessons = progresses.filter(p => p.status === 'in-progress').length;
    const totalSpent = progresses.reduce((sum, p) => sum + (p.paymentInfo.amount || 0), 0);
    const totalWatchTime = progresses.reduce((sum, p) => sum + (p.watchTime || 0), 0);
    
    // Category breakdown
    const categoryBreakdown = {};
    progresses.forEach(p => {
      if (p.lessonId) {
        const category = p.lessonId.category;
        if (!categoryBreakdown[category]) {
          categoryBreakdown[category] = { total: 0, completed: 0 };
        }
        categoryBreakdown[category].total++;
        if (p.status === 'completed') {
          categoryBreakdown[category].completed++;
        }
      }
    });
    
    // Recent activity
    const recentActivity = progresses.slice(0, 10).map(p => ({
      lessonTitle: p.lessonId?.title || 'Lesson không tồn tại',
      category: p.lessonId?.category || 'unknown',
      status: p.status,
      enrolledAt: p.enrolledAt,
      completedAt: p.completedAt,
      watchTime: p.watchTime || 0,
      progressPercentage: p.progressPercentage || 0
    }));
    
    // Learning streak calculation
    const currentStreak = calculateLearningStreak(progresses);
    
    const overview = {
      totalLessons,
      completedLessons,
      inProgressLessons,
      completionRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      totalSpent,
      totalWatchTime: Math.round(totalWatchTime / 60), // Convert to minutes
      currentStreak: user.stats.currentStreak || 0,
      longestStreak: user.stats.longestStreak || 0
    };
    
    res.json({
      success: true,
      data: {
        overview,
        categoryBreakdown,
        recentActivity,
        learningStats: {
          averageWatchTime: totalLessons > 0 ? Math.round(totalWatchTime / totalLessons / 60) : 0,
          favoriteCategory: Object.keys(categoryBreakdown).reduce((a, b) => 
            categoryBreakdown[a]?.total > categoryBreakdown[b]?.total ? a : b, 'vocabulary')
        }
      }
    });
    
  } catch (error) {
    console.error('Student analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê học sinh'
    });
  }
};

// Helper functions
const generateRevenueChart = async (lessonIds, days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const revenueData = await LessonProgress.aggregate([
    {
      $match: {
        lessonId: { $in: lessonIds },
        'paymentInfo.paidAt': {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$paymentInfo.paidAt'
          }
        },
        revenue: { $sum: '$paymentInfo.amount' },
        purchases: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  return revenueData.map(item => ({
    date: item._id,
    revenue: item.revenue,
    purchases: item.purchases
  }));
};

const generateMonthlyRevenue = async (months) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const monthlyData = await LessonProgress.aggregate([
    {
      $match: {
        'paymentInfo.paidAt': {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m',
            date: '$paymentInfo.paidAt'
          }
        },
        revenue: { $sum: '$paymentInfo.amount' },
        purchases: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  return monthlyData.map(item => ({
    month: item._id,
    revenue: item.revenue,
    purchases: item.purchases
  }));
};

const calculateLearningStreak = (progresses) => {
  if (!progresses.length) return 0;
  
  const completedProgresses = progresses
    .filter(p => p.status === 'completed' && p.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  
  if (!completedProgresses.length) return 0;
  
  let streak = 1;
  let currentDate = new Date(completedProgresses[0].completedAt);
  
  for (let i = 1; i < completedProgresses.length; i++) {
    const prevDate = new Date(completedProgresses[i].completedAt);
    const daysDiff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }
  
  return streak;
};

module.exports = {
  getTeacherAnalytics,
  getAdminAnalytics,
  getStudentAnalytics,
  getUserStreak
};