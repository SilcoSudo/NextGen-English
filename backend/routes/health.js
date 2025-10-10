const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const healthCheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'connected',
        server: 'running'
      }
    };

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      healthCheck.services.database = 'disconnected';
      healthCheck.message = 'Database connection issue';
      return res.status(503).json(healthCheck);
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    healthCheck.memory = {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      message: 'Service Unavailable',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Detailed status endpoint (for monitoring)
router.get('/status', async (req, res) => {
  try {
    const status = {
      server: {
        name: 'NextGen English API',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: {
          seconds: Math.floor(process.uptime()),
          human: formatUptime(process.uptime())
        },
        timestamp: new Date().toISOString()
      },
      database: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        name: mongoose.connection.name || 'unknown',
        host: mongoose.connection.host || 'localhost',
        collections: mongoose.connection.db ? 
          Object.keys(mongoose.connection.db.collections).length : 0
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        architecture: process.arch,
        pid: process.pid,
        memory: {
          total: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
          heap: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(process.memoryUsage().external / 1024 / 1024)} MB`
        }
      }
    };

    // Add CPU usage if available
    if (process.cpuUsage) {
      const cpuUsage = process.cpuUsage();
      status.system.cpu = {
        user: cpuUsage.user,
        system: cpuUsage.system
      };
    }

    res.status(200).json(status);
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Ready endpoint (for load balancers)
router.get('/ready', async (req, res) => {
  try {
    // Check if server is ready to accept traffic
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        ready: false,
        reason: 'Database not connected'
      });
    }

    res.status(200).json({
      ready: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      reason: error.message
    });
  }
});

// Live endpoint (for health checks)
router.get('/live', (req, res) => {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString()
  });
});

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

module.exports = router;