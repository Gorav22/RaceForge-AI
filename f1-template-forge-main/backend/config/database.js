import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @param {string} uri - MongoDB connection string
 */
const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;

