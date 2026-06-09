const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    if (!env.mongoUri) {
      throw new Error('MONGO_URI is required. Add a MongoDB Atlas/local connection string in server environment variables.');
    }
    const connection = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${formatDbError(error)}`);
    process.exit(1);
  }
};

const formatDbError = (error) => {
  const message = error.message || String(error);
  if (message.includes('ECONNREFUSED') && message.includes('127.0.0.1:27017')) {
    return 'Local MongoDB is not running. Start MongoDB locally or set MONGO_URI to a MongoDB Atlas connection string.';
  }
  return message;
};

module.exports = connectDB;
