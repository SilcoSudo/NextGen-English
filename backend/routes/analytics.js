const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  getTeacherAnalytics,
  getAdminAnalytics,
  getStudentAnalytics
} = require('../controllers/analyticsController');

// Teacher analytics routes
router.get('/teacher/:teacherId?', authenticateToken, getTeacherAnalytics);

// Admin analytics routes (admin only)
router.get('/admin', authenticateToken, requireAdmin, getAdminAnalytics);

// Student analytics routes
router.get('/student/:studentId?', authenticateToken, getStudentAnalytics);

module.exports = router;