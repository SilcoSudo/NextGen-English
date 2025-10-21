const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Họ tên không được để trống'],
    trim: true,
    minlength: [2, 'Họ tên phải có ít nhất 2 ký tự'],
    maxlength: [50, 'Họ tên không được quá 50 ký tự']
  },
  username: {
    type: String,
    required: [true, 'Tên đăng nhập không được để trống'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Tên đăng nhập phải có ít nhất 3 ký tự'],
    maxlength: [20, 'Tên đăng nhập không được quá 20 ký tự'],
    match: [/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới']
  },
  email: {
    type: String,
    required: [true, 'Email không được để trống'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Email không đúng định dạng'
    ]
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu không được để trống'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
  },
  role: {
    type: String,
    enum: {
      values: ['student', 'teacher', 'admin'],
      message: 'Role phải là student, teacher hoặc admin'
    },
    default: 'student'
  },
  avatar: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kitty&backgroundColor=ffeaa7&hair=short01&hairColor=fdcb6e&skinColor=f39c12&eyes=default&mouth=smile'
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow empty/null values
        if (!v) return true;
        // Only validate if phone field is being modified
        if (!this.isModified('phone')) return true;
        // Remove all non-digit characters for validation
        const cleanPhone = v.replace(/\D/g, '');
        // Accept any non-empty string for now to avoid login issues
        return cleanPhone.length >= 7 && cleanPhone.length <= 15;
      },
      message: 'Số điện thoại không đúng định dạng'
    }
  },
  dateOfBirth: {
    type: Date
  },
  bio: {
    type: String,
    maxlength: [500, 'Giới thiệu không được quá 500 ký tự'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  // Profile information
  profile: {
    age: {
      type: Number,
      min: [3, 'Tuổi phải từ 3 trở lên'],
      max: [100, 'Tuổi không được quá 100']
    },
    level: {
      type: String,
      enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    interests: [{
      type: String,
      trim: true
    }],
    timezone: {
      type: String,
      default: 'Asia/Ho_Chi_Minh'
    },
    language: {
      type: String,
      default: 'vi'
    }
  },
  // Learning statistics
  stats: {
    totalLessonsCompleted: {
      type: Number,
      default: 0
    },
    completedLessons: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number, // in minutes
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastLessonDate: {
      type: Date,
      default: null
    },
    lastActiveDate: {
      type: Date,
      default: null
    }
  },
  // Subscription info
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'vip'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'subscription.type': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for subscription status
userSchema.virtual('isSubscriptionActive').get(function() {
  if (this.subscription.type === 'free') return true;
  if (!this.subscription.endDate) return this.subscription.isActive;
  return this.subscription.isActive && new Date() < this.subscription.endDate;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update login stats
userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.loginCount += 1;
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Lỗi khi xác thực mật khẩu');
  }
};

// Instance method to update login info
userSchema.methods.updateLoginInfo = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

// Static method to find by email or username
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier.toLowerCase() }
    ]
  });
};

// Static method to get active users count
userSchema.statics.getActiveUsersCount = function() {
  return this.countDocuments({ isActive: true });
};

// Static method to get users by role
userSchema.statics.getUsersByRole = function(role) {
  return this.find({ role, isActive: true }).select('-password');
};

// Instance method to check if premium user
userSchema.methods.isPremium = function() {
  return ['premium', 'vip'].includes(this.subscription.type) && this.isSubscriptionActive;
};

// Instance method to update learning stats
userSchema.methods.updateLearningStats = function(lessonDuration) {
  this.stats.totalLessonsCompleted += 1;
  this.stats.totalTimeSpent += lessonDuration || 0;
  
  // Update streak
  const today = new Date();
  const lastLessonDate = this.stats.lastLessonDate;
  
  if (lastLessonDate) {
    const diffTime = Math.abs(today - lastLessonDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day
      this.stats.currentStreak += 1;
      if (this.stats.currentStreak > this.stats.longestStreak) {
        this.stats.longestStreak = this.stats.currentStreak;
      }
    } else if (diffDays > 1) {
      // Streak broken
      this.stats.currentStreak = 1;
    }
  } else {
    // First lesson
    this.stats.currentStreak = 1;
    this.stats.longestStreak = 1;
  }
  
  this.stats.lastLessonDate = today;
  return this.save();
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = token;
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return token;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = token;
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
  return token;
};

// Verify email verification token
userSchema.methods.verifyEmailToken = function(token) {
  return this.emailVerificationToken === token && 
         this.emailVerificationExpires && 
         this.emailVerificationExpires > new Date();
};

// Verify password reset token
userSchema.methods.verifyPasswordResetToken = function(token) {
  return this.passwordResetToken === token && 
         this.passwordResetExpires && 
         this.passwordResetExpires > new Date();
};

// Create model
const User = mongoose.model('User', userSchema);

module.exports = User;