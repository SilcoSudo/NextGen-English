const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      // Cấu hình MongoDB connection options
      const options = {
        maxPoolSize: parseInt(process.env.DB_MAX_CONNECTIONS) || 10,
        minPoolSize: parseInt(process.env.DB_MIN_CONNECTIONS) || 5,
        maxIdleTimeMS: 30000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip trying IPv6
        retryWrites: true,
        retryReads: true,
      };

      // Connect to MongoDB
      this.connection = await mongoose.connect(process.env.MONGODB_URI, options);

      console.log(`🗄️  MongoDB Connected: ${this.connection.connection.host}`);
      console.log(`📊  Database: ${this.connection.connection.name}`);

      // Event listeners for connection
      mongoose.connection.on('connected', () => {
        console.log('✅ Mongoose connected to MongoDB');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ Mongoose connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️  Mongoose disconnected from MongoDB');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      
      // Detailed error messages for common issues
      if (error.message.includes('ENOTFOUND')) {
        console.error('💡 Hint: Check if MongoDB is running or connection string is correct');
      } else if (error.message.includes('authentication failed')) {
        console.error('💡 Hint: Check username/password in connection string');
      } else if (error.message.includes('timeout')) {
        console.error('💡 Hint: Check network connection or MongoDB Atlas whitelist');
      }

      process.exit(1);
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
        console.log('👋 MongoDB connection closed');
      }
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error);
    }
  }

  // Health check method
  async healthCheck() {
    try {
      const state = mongoose.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };

      return {
        status: states[state],
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        port: mongoose.connection.port
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  // Get database statistics
  async getStats() {
    try {
      const admin = mongoose.connection.db.admin();
      const stats = await admin.serverStatus();
      
      return {
        version: stats.version,
        uptime: stats.uptime,
        connections: stats.connections,
        memory: stats.mem,
        host: stats.host
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return null;
    }
  }
}

// Export singleton instance
const database = new Database();
module.exports = database;