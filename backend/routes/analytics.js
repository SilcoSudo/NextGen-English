const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const teacherAuth = require('../middleware/teacherAuth');
const {
  getTeacherAnalytics,
  getAdminAnalytics,
  getStudentAnalytics,
  getUserStreak
} = require('../controllers/analyticsController');

// Teacher analytics routes
router.get('/teacher', authenticateToken, teacherAuth, getTeacherAnalytics);
router.get('/teacher/:teacherId', authenticateToken, teacherAuth, getTeacherAnalytics);

// Admin analytics routes (admin only)
router.get('/admin', authenticateToken, requireAdmin, getAdminAnalytics);

// Student analytics routes
router.get('/student', authenticateToken, getStudentAnalytics);
router.get('/student/:studentId', authenticateToken, getStudentAnalytics);

// Streak route
router.get('/streak', authenticateToken, getUserStreak);

module.exports = router;