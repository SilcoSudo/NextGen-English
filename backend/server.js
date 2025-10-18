const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import database connection
const database = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lessons');
const uploadRoutes = require('./routes/upload');
const analyticsRoutes = require('./routes/analytics');
const paymentRoutes = require('./routes/payment');
const healthRoutes = require('./routes/health');

const app = express();

// Trust proxy for Cloudflare (only in production)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware with CSP disabled for now
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for trusted proxies in production
  skip: (req, res) => process.env.NODE_ENV === 'production' && req.ip === req.connection.remoteAddress
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Use ALLOWED_ORIGINS from env or fallback to default
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim())
      : [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://localhost:3001',
          'https://nextgenenglish.id.vn',
          'https://www.nextgenenglish.id.vn',
          'https://api.nextgenenglish.id.vn'
        ];
    
    console.log('🌐 CORS Origin check:', origin);
    console.log('✅ Allowed Origins:', allowedOrigins);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('⚠️ CORS blocked origin:', origin);
      callback(null, true); // Allow all origins for now
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} from ${req.get('origin') || 'no-origin'}`);
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', healthRoutes);

// Serve static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    // Allow CORS for static files
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Serve video files with CORS
app.get('/api/videos/:filename', (req, res) => {
  const filename = req.params.filename;
  const videoPath = path.join(__dirname, 'uploads', 'videos', filename);

  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({
      success: false,
      message: 'Video không tồn tại'
    });
  }

  try {
    // Lấy thông tin file
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Detect MIME type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.3gp': 'video/3gpp',
      '.wmv': 'video/x-ms-wmv',
      '.mkv': 'video/x-matroska',
      '.flv': 'video/x-flv',
      '.asf': 'video/x-ms-asf',
      '.m4v': 'video/x-m4v',
      '.m2ts': 'video/vnd.dlna.mpeg-tts',
      '.ts': 'video/MP2T',
      '.mpg': 'video/mpeg',
      '.mpeg': 'video/mpeg'
    };
    const contentType = mimeTypes[ext] || 'video/mp4';

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (range) {
      // Hỗ trợ streaming với range requests
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // Validate range
      if (start >= fileSize || end >= fileSize) {
        res.status(416).set({
          'Content-Range': `bytes */${fileSize}`
        });
        return res.end();
      }

      // Ensure end is not greater than file size
      end = Math.min(end, fileSize - 1);
      const chunksize = (end - start) + 1;

      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'ETag': `"${stat.mtime.getTime()}-${fileSize}"`,
        'Last-Modified': stat.mtime.toUTCString()
      };

      res.writeHead(206, head);
      file.pipe(res);

      file.on('error', (err) => {
        console.error('Video streaming error:', err);
        res.end();
      });

    } else {
      // Serve toàn bộ file
      const head = {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'ETag': `"${stat.mtime.getTime()}-${fileSize}"`,
        'Last-Modified': stat.mtime.toUTCString()
      };
      res.writeHead(200, head);

      const stream = fs.createReadStream(videoPath);
      stream.pipe(res);

      stream.on('error', (err) => {
        console.error('Video serving error:', err);
        res.end();
      });
    }
  } catch (error) {
    console.error('Video endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi phát video'
    });
  }
});

// Serve image files with CORS
app.get('/api/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'uploads', 'images', filename);

  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({
      success: false,
      message: 'Hình ảnh không tồn tại'
    });
  }

  try {
    // Detect MIME type
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
      '.ico': 'image/x-icon'
    };
    const contentType = mimeTypes[ext] || 'image/jpeg';

    // Get file stats for caching
    const stat = fs.statSync(imagePath);

    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.setHeader('ETag', `"${stat.mtime.getTime()}-${stat.size}"`);
    res.setHeader('Last-Modified', stat.mtime.toUTCString());

    // Stream the image
    const stream = fs.createReadStream(imagePath);
    stream.pipe(res);

    stream.on('error', (err) => {
      console.error('Image serving error:', err);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tải hình ảnh'
      });
    });

  } catch (error) {
    console.error('Image endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xử lý hình ảnh'
    });
  }
});

// Serve static files from React build (Production)
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(buildPath));
  
  // Handle React Router (return all requests to React app)
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        error: 'API endpoint không tồn tại',
        message: `Không tìm thấy ${req.method} ${req.originalUrl}`
      });
    }
    
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Chào mừng đến với NextGen English API',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/health'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint không tồn tại',
    message: `Không tìm thấy ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'POST /api/auth/logout',
      'GET /api/auth/me',
      'GET /api/lessons',
      'POST /api/lessons',
      'GET /api/lessons/teacher/my-lessons',
      'PUT /api/lessons/:id',
      'DELETE /api/lessons/:id',
      'POST /api/upload/video',
      'POST /api/upload/image',
      'GET /api/upload/my-videos',
      'DELETE /api/upload/video/:filename',
      'GET /api/videos/:filename',
      'GET /api/images/:filename'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error:', error);
  
  res.status(error.status || 500).json({
    error: error.message || 'Lỗi máy chủ nội bộ',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database first
    await database.connect();
    
    // Then start the server
    app.listen(PORT, () => {
      console.log(`🚀 NextGen English API đang chạy trên port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;