const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Sub-schema for lesson content
const lessonContentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['video', 'audio', 'text', 'quiz', 'exercise', 'game'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    // For video/audio: URL
    // For text: HTML content
    // For quiz: questions array
    // For exercise: exercise data
    url: String,
    text: String,
    data: mongoose.Schema.Types.Mixed
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Sub-schema for lessons
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề bài học không được để trống'],
    trim: true,
    maxlength: [100, 'Tiêu đề không được quá 100 ký tự']
  },
  description: {
    type: String,
    required: [true, 'Mô tả bài học không được để trống'],
    trim: true,
    maxlength: [500, 'Mô tả không được quá 500 ký tự']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  content: [lessonContentSchema],
  skills: [{
    type: String,
    enum: ['listening', 'speaking', 'reading', 'writing', 'vocabulary', 'grammar', 'pronunciation'],
    required: true
  }],
  level: {
    type: String,
    enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true,
    min: [1, 'Thời gian học phải ít nhất 1 phút']
  },
  order: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  // Learning objectives
  objectives: [{
    type: String,
    trim: true
  }],
  // Prerequisites
  prerequisites: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course.lessons'
    },
    title: String
  }],
  // Quiz/Assessment
  quiz: {
    questions: [{
      question: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'fill-blank', 'audio', 'speaking'],
        required: true
      },
      options: [String], // For multiple choice
      correctAnswer: mongoose.Schema.Types.Mixed,
      explanation: String,
      points: {
        type: Number,
        default: 1
      }
    }],
    passingScore: {
      type: Number,
      default: 70
    },
    timeLimit: {
      type: Number, // in minutes
      default: null
    }
  }
}, { 
  timestamps: true,
  _id: true 
});

// Main Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề khóa học không được để trống'],
    trim: true,
    maxlength: [100, 'Tiêu đề không được quá 100 ký tự']
  },
  description: {
    type: String,
    required: [true, 'Mô tả khóa học không được để trống'],
    trim: true,
    maxlength: [1000, 'Mô tả không được quá 1000 ký tự']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang']
  },
  thumbnail: {
    type: String,
    required: [true, 'Hình ảnh khóa học không được để trống']
  },
  category: {
    type: String,
    required: [true, 'Danh mục không được để trống'],
    enum: {
      values: ['speaking', 'listening', 'reading', 'writing', 'vocabulary', 'grammar', 'pronunciation', 'business', 'kids'],
      message: 'Danh mục không hợp lệ'
    }
  },
  level: {
    type: String,
    required: [true, 'Cấp độ không được để trống'],
    enum: {
      values: ['beginner', 'elementary', 'intermediate', 'advanced'],
      message: 'Cấp độ không hợp lệ'
    }
  },
  ageGroup: {
    type: String,
    enum: ['kids', 'teens', 'adults', 'all'],
    default: 'all'
  },
  lessons: [lessonSchema],
  
  // Course metadata
  instructor: {
    name: {
      type: String,
      required: true
    },
    bio: String,
    avatar: String,
    credentials: [String]
  },
  
  // Pricing
  pricing: {
    type: {
      type: String,
      enum: ['free', 'premium', 'paid'],
      default: 'free'
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'VND'
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0
    }
  },

  // Course statistics
  stats: {
    totalEnrollments: {
      type: Number,
      default: 0
    },
    totalCompletions: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    totalDuration: {
      type: Number, // in minutes, calculated from lessons
      default: 0
    }
  },

  // Course settings
  settings: {
    isActive: {
      type: Boolean,
      default: true
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    allowComments: {
      type: Boolean,
      default: true
    },
    allowRating: {
      type: Boolean,
      default: true
    },
    autoEnroll: {
      type: Boolean,
      default: false
    }
  },

  // SEO and tags
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  keywords: [{
    type: String,
    trim: true
  }],

  // Course requirements and what students will learn
  requirements: [{
    type: String,
    trim: true
  }],
  whatYouWillLearn: [{
    type: String,
    trim: true
  }],

  // Publication info
  publishedAt: {
    type: Date,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ slug: 1 }, { unique: true });
courseSchema.index({ 'settings.isActive': 1, 'settings.isPublished': 1 });
courseSchema.index({ 'pricing.type': 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ createdAt: -1 });

// Virtual for completion rate
courseSchema.virtual('completionRate').get(function() {
  if (this.stats.totalEnrollments === 0) return 0;
  return Math.round((this.stats.totalCompletions / this.stats.totalEnrollments) * 100);
});

// Virtual for total lessons count
courseSchema.virtual('totalLessons').get(function() {
  return this.lessons.length;
});

// Virtual for active lessons count
courseSchema.virtual('activeLessons').get(function() {
  return this.lessons.filter(lesson => lesson.isActive).length;
});

// Virtual for premium lessons count
courseSchema.virtual('premiumLessons').get(function() {
  return this.lessons.filter(lesson => lesson.isPremium).length;
});

// Pre-save middleware to calculate total duration
courseSchema.pre('save', function(next) {
  if (this.isModified('lessons')) {
    this.stats.totalDuration = this.lessons.reduce((total, lesson) => {
      return total + (lesson.estimatedDuration || 0);
    }, 0);
  }
  
  if (this.isModified('settings.isPublished') && this.settings.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  this.lastUpdated = new Date();
  next();
});

// Static method to get popular courses
courseSchema.statics.getPopularCourses = function(limit = 10) {
  return this.find({
    'settings.isActive': true,
    'settings.isPublished': true
  })
  .sort({ 'stats.totalEnrollments': -1, 'stats.averageRating': -1 })
  .limit(limit)
  .select('-lessons.content -lessons.quiz');
};

// Static method to get courses by category
courseSchema.statics.getCoursesByCategory = function(category, options = {}) {
  const query = {
    category,
    'settings.isActive': true,
    'settings.isPublished': true
  };
  
  if (options.level) {
    query.level = options.level;
  }
  
  return this.find(query)
    .sort(options.sort || { createdAt: -1 })
    .select('-lessons.content -lessons.quiz');
};

// Static method to search courses
courseSchema.statics.searchCourses = function(searchTerm, options = {}) {
  const query = {
    $and: [
      {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      },
      { 'settings.isActive': true, 'settings.isPublished': true }
    ]
  };
  
  if (options.category) {
    query.$and.push({ category: options.category });
  }
  
  if (options.level) {
    query.$and.push({ level: options.level });
  }
  
  return this.find(query)
    .sort(options.sort || { 'stats.averageRating': -1, 'stats.totalEnrollments': -1 })
    .select('-lessons.content -lessons.quiz');
};

// Instance method to get lesson by ID
courseSchema.methods.getLessonById = function(lessonId) {
  return this.lessons.id(lessonId);
};

// Instance method to add enrollment
courseSchema.methods.addEnrollment = function() {
  this.stats.totalEnrollments += 1;
  return this.save();
};

// Instance method to add completion
courseSchema.methods.addCompletion = function() {
  this.stats.totalCompletions += 1;
  return this.save();
};

// Instance method to update rating
courseSchema.methods.updateRating = function(newRating, isNewReview = true) {
  if (isNewReview) {
    const totalRatingPoints = this.stats.averageRating * this.stats.totalReviews;
    this.stats.totalReviews += 1;
    this.stats.averageRating = (totalRatingPoints + newRating) / this.stats.totalReviews;
  } else {
    // Recalculate if needed
    // This would require storing individual ratings
  }
  return this.save();
};

// Add pagination plugin
courseSchema.plugin(mongoosePaginate);

// Create model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;