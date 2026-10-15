import mongoose from 'mongoose';

// Cache the connection across serverless function invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If a connection already exists, reuse it immediately
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // If a connection promise is not already in flight, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents queries from buffering and hanging past Vercel timeouts
      serverSelectionTimeoutMS: 5000, // Fails fast in 5 seconds if Atlas is unreachable
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('MongoDB connection established');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset promise so subsequent requests can retry
    console.error('Error connecting to MongoDB:', error.message);
    throw error; // Re-throw so your route or middleware catches the failure
  }
};

export default connectDB;