import mongoose from 'mongoose';

// Use environment variable or default for Docker
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/praja-collections';

// Only throw error at runtime, not during build
if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  console.warn('⚠️ MONGODB_URI not set, using default connection string');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB Connection Error:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;