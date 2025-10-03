// Middleware to check if user is teacher or admin
const teacherAuth = (req, res, next) => {
  try {
    // Check if user exists (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user found'
      });
    }

    // Check if user has teacher or admin role
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher or Admin role required'
      });
    }

    next();
  } catch (error) {
    console.error('Teacher auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authorization'
    });
  }
};

module.exports = teacherAuth;