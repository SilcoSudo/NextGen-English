const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getTeacherCourses,
  updateCourseStatus
} = require('../controllers/courseController');
const { authenticateToken } = require('../middleware/auth');
const teacherAuth = require('../middleware/teacherAuth');

// Course validation rules
const courseValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer (minutes)'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('videoUrl')
    .optional()
    .isURL()
    .withMessage('Video URL must be a valid URL'),
  body('thumbnailUrl')
    .optional()
    .isURL()
    .withMessage('Thumbnail URL must be a valid URL'),
  body('objectives')
    .optional()
    .isArray()
    .withMessage('Objectives must be an array'),
  body('prerequisites')
    .optional()
    .isArray()
    .withMessage('Prerequisites must be an array'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived')
];

// Public routes
router.get('/', getCourses);

// Protected routes - require authentication (specific routes first)
router.get('/teacher/my-courses', authenticateToken, teacherAuth, getTeacherCourses);
router.post('/', authenticateToken, teacherAuth, courseValidation, createCourse);
router.put('/:id/status', authenticateToken, teacherAuth, updateCourseStatus);
router.put('/:id', authenticateToken, teacherAuth, courseValidation, updateCourse);
router.delete('/:id', authenticateToken, teacherAuth, deleteCourse);

// Public routes with parameters (must be last)
router.get('/:id', getCourse);

module.exports = router;