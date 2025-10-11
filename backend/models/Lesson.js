const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// Main Lesson Schema
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
  
  // Teacher who created this lesson
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Lesson content
  videoUrl: {
    type: String,
    required: [true, 'Video bài học không được để trống'],
    trim: true
  },
  thumbnail: {
    type: String,
    required: [true, 'Hình ảnh bài học không được để trống'],
    trim: true
  },
  
  // Age group and duration
  ageGroup: {
    type: String,
    required: [true, 'Độ tuổi không được để trống'],
    enum: {
      values: ['6-8', '8-10'],
      message: 'Độ tuổi phải là 6-8 hoặc 8-10'
    }
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Thời lượng không được để trống'],
    min: [1, 'Thời lượng phải ít nhất 1 phút'],
    max: [180, 'Thời lượng không được quá 180 phút']
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Giá không được để trống'],
    min: [0, 'Giá không được âm'],
    default: 0
  },
  currency: {
    type: String,
    default: 'VND',
    enum: ['VND', 'USD']
  },
  
  // Minigame integration
  minigameUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'URL minigame phải bắt đầu bằng http:// hoặc https://'
    }
  },
  
  // Status
  status: {
    type: String,
    required: true,
    enum: {
      values: ['draft', 'published', 'archived'],
      message: 'Trạng thái phải là draft, published hoặc archived'
    },
    default: 'draft'
  },
  
  // Additional metadata
  category: {
    type: String,
    required: true,
    enum: {
      values: ['speaking', 'listening', 'reading', 'writing', 'vocabulary', 'grammar', 'pronunciation'],
      message: 'Danh mục không hợp lệ'
    }
  },
  level: {
    type: String,
    required: true,
    enum: {
      values: ['beginner', 'elementary', 'intermediate', 'advanced'],
      message: 'Cấp độ không hợp lệ'
    }
  },
  
  // Learning objectives (what students will achieve)
  objectives: [{
    type: String,
    trim: true,
    maxlength: [200, 'Mục tiêu không được quá 200 ký tự']
  }],
  
  // Prerequisites (what students need to know before starting)
  prerequisites: [{
    type: String,
    trim: true,
    maxlength: [150, 'Điều kiện tiên quyết không được quá 150 ký tự']
  }],
  
  // Tags for search and categorization
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag không được quá 50 ký tự']
  }],
  
  // Statistics for individual lesson sales
  stats: {
    totalViews: {
      type: Number,
      default: 0
    },
    totalPurchases: {
      type: Number,
      default: 0
    },
    totalCompletions: {
      type: Number,
      default: 0
    },
    totalRevenue: {
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
    }
  },
  
  // Settings
  settings: {
    allowComments: {
      type: Boolean,
      default: true
    },
    allowRating: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  
  // Timestamps
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
lessonSchema.index({ title: 'text', description: 'text' });
lessonSchema.index({ createdBy: 1, status: 1 });
lessonSchema.index({ status: 1, ageGroup: 1, category: 1 });
lessonSchema.index({ slug: 1 }, { unique: true });
lessonSchema.index({ price: 1 });
lessonSchema.index({ tags: 1 });
lessonSchema.index({ createdAt: -1 });
lessonSchema.index({ 'stats.averageRating': -1 });

// Virtual for completion rate
lessonSchema.virtual('completionRate').get(function() {
  if (this.stats.totalPurchases === 0) return 0;
  return Math.round((this.stats.totalCompletions / this.stats.totalPurchases) * 100);
});

// Virtual for purchase conversion rate
lessonSchema.virtual('purchaseConversionRate').get(function() {
  if (this.stats.totalViews === 0) return 0;
  return Math.round((this.stats.totalPurchases / this.stats.totalViews) * 100);
});

// Virtual for formatted price
lessonSchema.virtual('formattedPrice').get(function() {
  if (this.price === 0) return 'Miễn phí';
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: this.currency || 'VND'
  }).format(this.price);
});

// Pre-save middleware
lessonSchema.pre('save', function(next) {
  // Auto-generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple hyphens
      .trim('-'); // Remove leading/trailing hyphens
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Update lastUpdated
  this.lastUpdated = new Date();
  
  next();
});

// Static methods

// Get lessons by teacher
lessonSchema.statics.getByTeacher = function(teacherId, options = {}) {
  const query = { createdBy: teacherId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query)
    .sort(options.sort || { createdAt: -1 })
    .populate('createdBy', 'name username avatar');
};

// Get published lessons for students
lessonSchema.statics.getPublishedLessons = function(options = {}) {
  const query = {
    status: 'published',
    'settings.isActive': true
  };
  
  if (options.ageGroup) {
    query.ageGroup = options.ageGroup;
  }
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.level) {
    query.level = options.level;
  }
  
  return this.find(query)
    .sort(options.sort || { createdAt: -1 })
    .populate('createdBy', 'name username avatar');
};

// Search lessons
lessonSchema.statics.searchLessons = function(searchTerm, options = {}) {
  const query = {
    $and: [
      {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      },
      { status: 'published', 'settings.isActive': true }
    ]
  };
  
  if (options.ageGroup) {
    query.$and.push({ ageGroup: options.ageGroup });
  }
  
  if (options.category) {
    query.$and.push({ category: options.category });
  }
  
  return this.find(query)
    .sort(options.sort || { 'stats.averageRating': -1, 'stats.totalEnrollments': -1 })
    .populate('createdBy', 'name username avatar');
};

// Instance methods

// Check if user can edit this lesson
lessonSchema.methods.canEdit = function(user) {
  if (user.role === 'admin') return true;
  if (user.role === 'teacher' && this.createdBy.toString() === user._id.toString()) return true;
  return false;
};

// Update statistics
lessonSchema.methods.addView = function() {
  this.stats.totalViews += 1;
  return this.save();
};

lessonSchema.methods.addPurchase = function(amount = 0) {
  this.stats.totalPurchases += 1;
  this.stats.totalRevenue += amount;
  this.stats.conversionRate = this.stats.totalViews > 0 ? 
    Math.round((this.stats.totalPurchases / this.stats.totalViews) * 100) : 0;
  return this.save();
};

lessonSchema.methods.addCompletion = function() {
  this.stats.totalCompletions += 1;
  return this.save();
};

lessonSchema.methods.updateRating = function(newRating, isNewReview = true) {
  if (isNewReview) {
    const totalRatingPoints = this.stats.averageRating * this.stats.totalReviews;
    this.stats.totalReviews += 1;
    this.stats.averageRating = (totalRatingPoints + newRating) / this.stats.totalReviews;
  }
  return this.save();
};

// Add pagination plugin
lessonSchema.plugin(mongoosePaginate);

// Create model
const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;