/* =====================================================
   MongoDB Connection Manager
   ===================================================== */

import mongoose from 'mongoose';
import config from './env.js';

/**
 * Connect to MongoDB with retry logic and connection pooling.
 * Caches connection in serverless environments to reuse across invocations.
 */
let cached = global.__mongooseConnection;

if (!cached) {
  cached = global.__mongooseConnection = { conn: null, promise: null };
}

export async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  if (!config.MONGODB_URI) {
    console.error('❌ MONGODB_URI not set — database unavailable');
    throw new Error('MONGODB_URI is required');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('🔌 Connecting to MongoDB...');

    cached.promise = mongoose
      .connect(config.MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('✅ MongoDB connected successfully');
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('❌ MongoDB connection failed:', err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * Disconnect gracefully (for testing / shutdown)
 */
export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 MongoDB disconnected');
  }
}

export default connectDB;
