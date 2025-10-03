const mongoose = require('mongoose');

// Sub-schema for lesson progress
const lessonProgressSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'skipped'],
    default: 'not-started'
  },
  completedAt: {
    type: Date,
    default: null
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  attempts: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  // Track which content pieces were completed
  completedContent: [{
    contentId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
    timeSpent: Number
  }],
  // Quiz results
  quizResults: [{
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
  notes: {
    type: String,
    maxlength: 1000
  }
}, { 
  timestamps: true,
  _id: false 
});

// Main Progress Schema
const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // Overall course progress
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'paused'],
    default: 'not-started'
  },
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
  
  // Progress statistics
  stats: {
    totalLessons: {
      type: Number,
      default: 0
    },
    completedLessons: {
      type: Number,
      default: 0
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    totalTimeSpent: {
      type: Number, // in minutes
      default: 0
    },
    averageScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },
    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastStudyDate: {
        type: Date,
        default: null
      }
    }
  },
  
  // Detailed lesson progress
  lessons: [lessonProgressSchema],
  
  // Course rating and feedback
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
  
  // Learning preferences and settings
  preferences: {
    studyReminders: {
      enabled: {
        type: Boolean,
        default: true
      },
      time: {
        type: String,
        default: '20:00'
      },
      days: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }]
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    playbackSpeed: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 2.0
    }
  },
  
  // Certificates
  certificates: [{
    type: {
      type: String,
      enum: ['completion', 'achievement', 'mastery']
    },
    issuedAt: Date,
    certificateId: String,
    downloadUrl: String
  }],
  
  // Bookmarks and favorites
  bookmarks: [{
    lessonId: mongoose.Schema.Types.ObjectId,
    contentId: mongoose.Schema.Types.ObjectId,
    note: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better performance
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
progressSchema.index({ userId: 1, status: 1 });
progressSchema.index({ courseId: 1, status: 1 });
progressSchema.index({ lastAccessedAt: -1 });
progressSchema.index({ 'stats.completionPercentage': -1 });

// Virtual for current lesson
progressSchema.virtual('currentLesson').get(function() {
  const inProgressLesson = this.lessons.find(lesson => lesson.status === 'in-progress');
  if (inProgressLesson) return inProgressLesson;
  
  const nextLesson = this.lessons.find(lesson => lesson.status === 'not-started');
  return nextLesson || null;
});

// Virtual for next lesson
progressSchema.virtual('nextLesson').get(function() {
  return this.lessons.find(lesson => lesson.status === 'not-started') || null;
});

// Pre-save middleware to calculate completion percentage
progressSchema.pre('save', function(next) {
  if (this.isModified('lessons') || this.isNew) {
    const completedLessons = this.lessons.filter(lesson => lesson.status === 'completed').length;
    const totalLessons = this.lessons.length;
    
    this.stats.completedLessons = completedLessons;
    this.stats.totalLessons = totalLessons;
    this.stats.completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    // Calculate average score
    const completedLessonsWithScore = this.lessons.filter(lesson => 
      lesson.status === 'completed' && lesson.score !== null
    );
    
    if (completedLessonsWithScore.length > 0) {
      const totalScore = completedLessonsWithScore.reduce((sum, lesson) => sum + lesson.score, 0);
      this.stats.averageScore = Math.round(totalScore / completedLessonsWithScore.length);
    }
    
    // Calculate total time spent
    this.stats.totalTimeSpent = Math.round(
      this.lessons.reduce((total, lesson) => total + (lesson.timeSpent || 0), 0) / 60
    );
    
    // Update course status
    if (this.stats.completionPercentage === 100) {
      this.status = 'completed';
      if (!this.completedAt) {
        this.completedAt = new Date();
      }
    } else if (this.stats.completionPercentage > 0) {
      this.status = 'in-progress';
      if (!this.startedAt) {
        this.startedAt = new Date();
      }
    }
  }
  
  next();
});

// Static method to get user progress overview
progressSchema.statics.getUserProgressOverview = function(userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgCompletion: { $avg: '$stats.completionPercentage' },
        totalTimeSpent: { $sum: '$stats.totalTimeSpent' }
      }
    }
  ]);
};

// Static method to get course progress analytics
progressSchema.statics.getCourseAnalytics = function(courseId) {
  return this.aggregate([
    { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: null,
        totalEnrollments: { $sum: 1 },
        completedCount: { 
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        inProgressCount: { 
          $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
        },
        avgCompletionPercentage: { $avg: '$stats.completionPercentage' },
        avgTimeSpent: { $avg: '$stats.totalTimeSpent' },
        avgRating: { 
          $avg: { 
            $cond: [{ $ne: ['$rating.score', null] }, '$rating.score', null] 
          }
        }
      }
    }
  ]);
};

// Instance method to start lesson
progressSchema.methods.startLesson = function(lessonId) {
  let lessonProgress = this.lessons.find(l => l.lessonId.toString() === lessonId.toString());
  
  if (!lessonProgress) {
    lessonProgress = {
      lessonId: lessonId,
      status: 'in-progress',
      attempts: 1
    };
    this.lessons.push(lessonProgress);
  } else if (lessonProgress.status === 'not-started') {
    lessonProgress.status = 'in-progress';
    lessonProgress.attempts += 1;
  }
  
  this.lastAccessedAt = new Date();
  return this.save();
};

// Instance method to complete lesson
progressSchema.methods.completeLesson = function(lessonId, score = null, timeSpent = 0) {
  const lessonProgress = this.lessons.find(l => l.lessonId.toString() === lessonId.toString());
  
  if (lessonProgress) {
    lessonProgress.status = 'completed';
    lessonProgress.completedAt = new Date();
    lessonProgress.score = score;
    lessonProgress.timeSpent += timeSpent;
    
    // Update streak
    this.updateStreak();
  }
  
  this.lastAccessedAt = new Date();
  return this.save();
};

// Instance method to update streak
progressSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastStudyDate = this.stats.streak.lastStudyDate;
  
  if (lastStudyDate) {
    const lastStudy = new Date(lastStudyDate);
    lastStudy.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastStudy.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    
    if (diffDays === 1) {
      // Consecutive day
      this.stats.streak.current += 1;
      if (this.stats.streak.current > this.stats.streak.longest) {
        this.stats.streak.longest = this.stats.streak.current;
      }
    } else if (diffDays > 1) {
      // Streak broken
      this.stats.streak.current = 1;
    }
    // If diffDays === 0, same day - don't change streak
  } else {
    // First study day
    this.stats.streak.current = 1;
    this.stats.streak.longest = 1;
  }
  
  this.stats.streak.lastStudyDate = new Date();
};

// Instance method to add bookmark
progressSchema.methods.addBookmark = function(lessonId, contentId = null, note = '') {
  const bookmark = {
    lessonId,
    contentId,
    note,
    createdAt: new Date()
  };
  
  this.bookmarks.push(bookmark);
  return this.save();
};

// Instance method to rate course
progressSchema.methods.rateCourse = function(score, review = '') {
  this.rating = {
    score,
    review,
    ratedAt: new Date()
  };
  
  return this.save();
};

// Create model
const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;