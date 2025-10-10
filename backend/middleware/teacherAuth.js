// Middleware to check if user is teacher or admin
const teacherAuth = (req, res, next) => {
  try {
    console.log('👨‍🏫 TeacherAuth - User:', req.user?.username || 'None');
    console.log('👨‍🏫 TeacherAuth - Role:', req.user?.role || 'None');
    
    // Check if user exists (should be set by auth middleware)
    if (!req.user) {
      console.log('❌ TeacherAuth: No user found in request');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user found'
      });
    }

    // Check if user has teacher or admin role
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      console.log('❌ TeacherAuth: Invalid role -', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher or Admin role required'
      });
    }

    console.log('✅ TeacherAuth: Access granted');
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