const mongoose = require('mongoose');

// User Progress cho từng bài học
const lessonProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  
  // Progress status (simplified for individual lesson purchase)
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  
  // Timestamps
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date, 
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  
  // Progress details
  watchTime: {
    type: Number, // in seconds
    default: 0
  },
  totalTime: {
    type: Number, // lesson duration in seconds
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Quiz/Assessment results
  quizAttempts: [{
    attemptNumber: Number,
    score: Number,
    answers: [{
      questionId: String,
      userAnswer: mongoose.Schema.Types.Mixed,
      isCorrect: Boolean,
      timeSpent: Number
    }],
    completedAt: Date,
    passed: Boolean
  }],
  
  bestScore: {
    type: Number,
    default: null,
    min: 0,
    max: 100
  },
  
  // User feedback
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    review: {
      type: String,
      maxlength: 500
    },
    ratedAt: {
      type: Date,
      default: null
    }
  },
  
  // Notes and bookmarks
  notes: {
    type: String,
    maxlength: 1000
  },
  bookmarks: [{
    timestamp: Number, // position in video (seconds)
    note: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Payment info (required for individual lesson purchase)
  paymentInfo: {
    paid: {
      type: Boolean,
      required: true,
      default: false
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['free', 'card', 'bank', 'wallet', 'paypal'],
      required: true,
      default: 'free'
    },
    transactionId: {
      type: String,
      default: null
    },
    currency: {
      type: String,
      default: 'VND'
    },
    paidAt: {
      type: Date,
      default: null
    }
  },
  
  // Access info
  access: {
    hasLifetimeAccess: {
      type: Boolean,
      default: true // Once purchased, lifetime access
    },
    expiresAt: {
      type: Date,
      default: null // null = lifetime
    },
    downloadAllowed: {
      type: Boolean,
      default: false
    }
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes
lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ userId: 1, status: 1 });
lessonProgressSchema.index({ lessonId: 1, status: 1 });
lessonProgressSchema.index({ lastAccessedAt: -1 });
lessonProgressSchema.index({ completedAt: -1 });

// Virtual for completion status
lessonProgressSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

// Virtual for watch percentage
lessonProgressSchema.virtual('watchPercentage').get(function() {
  if (this.totalTime === 0) return 0;
  return Math.round((this.watchTime / this.totalTime) * 100);
});

// Pre-save middleware
lessonProgressSchema.pre('save', function(next) {
  // Update timestamps based on status changes
  if (this.isModified('status')) {
    if (this.status === 'in-progress' && !this.startedAt) {
      this.startedAt = new Date();
    } else if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
      this.progressPercentage = 100;
    }
  }
  
  // Auto-set payment info for free lessons
  if (this.isNew && !this.paymentInfo.paid) {
    // This will be handled by controller when lesson price is known
  }
  
  // Update lastAccessedAt
  if (this.isModified('watchTime') || this.isModified('status')) {
    this.lastAccessedAt = new Date();
  }
  
  next();
});

// Post-save middleware for basic stats update
lessonProgressSchema.post('save', async function() {
  try {
    const User = require('./User');
    
    // Check if lesson was just completed or had activity
    if (this.status === 'completed' && this.isModified('status')) {
      console.log(`✅ Lesson completed by user ${this.userId}`);
      
      // Update user stats
      const user = await User.findById(this.userId);
      if (user) {
        // Update completed lessons count
        await User.findByIdAndUpdate(this.userId, {
          $inc: { 'stats.completedLessons': 1 }
        });
        
        // Update streak based on activity
        await updateUserStreak(this.userId);
      }
    } else if (this.isModified('watchTime') && this.watchTime > 0) {
      // Update streak on any watch activity (not just completion)
      await updateUserStreak(this.userId);
    }
  } catch (error) {
    console.error('Stats update error in Progress post-save:', error);
  }
});

// Static methods

// Get user's lesson progress overview
lessonProgressSchema.statics.getUserOverview = function(userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalWatchTime: { $sum: '$watchTime' }
      }
    }
  ]);
};

// Get lesson analytics
lessonProgressSchema.statics.getLessonAnalytics = function(lessonId) {
  return this.aggregate([
    { $match: { lessonId: new mongoose.Types.ObjectId(lessonId) } },
    {
      $group: {
        _id: null,
        totalPurchases: { $sum: 1 },
        completedCount: { 
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        inProgressCount: { 
          $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
        },
        notStartedCount: { 
          $sum: { $cond: [{ $eq: ['$status', 'not-started'] }, 1, 0] }
        },
        avgWatchTime: { $avg: '$watchTime' },
        avgProgressPercentage: { $avg: '$progressPercentage' },
        avgRating: { 
          $avg: { 
            $cond: [{ $ne: ['$rating.score', null] }, '$rating.score', null] 
          }
        },
        totalRevenue: { $sum: '$paymentInfo.amount' }
      }
    }
  ]);
};

// Instance methods

// Start watching lesson
lessonProgressSchema.methods.startWatching = function() {
  if (this.status === 'not-started') {
    this.status = 'in-progress';
    this.startedAt = new Date();
  }
  this.lastAccessedAt = new Date();
  return this.save();
};

// Update watch progress
lessonProgressSchema.methods.updateProgress = function(watchTime, totalTime) {
  // Validate inputs
  if (typeof watchTime !== 'number' || watchTime < 0) {
    throw new Error('watchTime must be a positive number');
  }
  if (typeof totalTime !== 'number' || totalTime <= 0) {
    throw new Error('totalTime must be a positive number greater than 0');
  }
  
  // Update watchTime (allow going backwards for rewatching)
  this.watchTime = Math.max(0, Math.min(watchTime, totalTime));
  this.totalTime = totalTime;
  
  // Calculate progress percentage (capped at 100)
  if (this.totalTime > 0) {
    this.progressPercentage = Math.min(100, Math.round((this.watchTime / this.totalTime) * 100));
  } else {
    this.progressPercentage = 0;
  }
  
  // Auto-complete if watched 90% or more
  if (this.progressPercentage >= 90 && this.status !== 'completed') {
    this.status = 'completed';
    this.completedAt = new Date();
    this.progressPercentage = 100;
  } else if (this.status === 'not-started') {
    this.status = 'in-progress';
    this.startedAt = new Date();
  }
  
  this.lastAccessedAt = new Date();
  return this.save();
};

// Complete lesson viewing manually
lessonProgressSchema.methods.completeWatching = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  this.progressPercentage = 100;
  this.lastAccessedAt = new Date();
  return this.save();
};

// Add quiz result
lessonProgressSchema.methods.addQuizResult = function(score, answers, passed) {
  const attempt = {
    attemptNumber: this.quizAttempts.length + 1,
    score,
    answers,
    completedAt: new Date(),
    passed
  };
  
  this.quizAttempts.push(attempt);
  
  // Update best score
  if (!this.bestScore || score > this.bestScore) {
    this.bestScore = score;
  }
  
  // Auto-complete if quiz passed and not already completed
  if (passed && this.status !== 'completed') {
    this.status = 'completed';
    this.completedAt = new Date();
    this.progressPercentage = 100;
  }
  
  return this.save();
};

// Rate lesson
lessonProgressSchema.methods.rateLesson = function(score, review = '') {
  this.rating = {
    score,
    review,
    ratedAt: new Date()
  };
  
  return this.save();
};

// Add bookmark
lessonProgressSchema.methods.addBookmark = function(timestamp, note = '') {
  const bookmark = {
    timestamp,
    note,
    createdAt: new Date()
  };
  
  this.bookmarks.push(bookmark);
  return this.save();
};

// Process payment
lessonProgressSchema.methods.processPayment = function(amount, paymentMethod, transactionId = null) {
  this.paymentInfo = {
    paid: true,
    paidAt: new Date(),
    amount,
    paymentMethod,
    transactionId,
    currency: 'VND'
  };
  
  return this.save();
};

// Helper function to update user streak
const updateUserStreak = async (userId) => {
  try {
    const User = require('./User');
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (user.stats.lastActiveDate) {
      const lastActive = new Date(user.stats.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      if (lastActive.getTime() === yesterday.getTime()) {
        // Continue streak
        await User.findByIdAndUpdate(userId, {
          $inc: { 'stats.currentStreak': 1 },
          $set: { 'stats.lastActiveDate': today },
          $max: { 'stats.longestStreak': user.stats.currentStreak + 1 }
        });
      } else if (lastActive.getTime() < yesterday.getTime()) {
        // Streak broken - reset to 1
        await User.findByIdAndUpdate(userId, {
          $set: {
            'stats.currentStreak': 1,
            'stats.lastActiveDate': today
          },
          $max: { 'stats.longestStreak': Math.max(user.stats.longestStreak || 0, 1) }
        });
      }
      // If lastActive is today, don't update (already counted for today)
    } else {
      // First activity - start streak
      await User.findByIdAndUpdate(userId, {
        $set: {
          'stats.currentStreak': 1,
          'stats.longestStreak': 1,
          'stats.lastActiveDate': today
        }
      });
    }
  } catch (error) {
    console.error('Error updating user streak:', error);
  }
};

// Create model
const LessonProgress = mongoose.model('LessonProgress', lessonProgressSchema);

module.exports = LessonProgress;