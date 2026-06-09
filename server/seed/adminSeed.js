const mongoose = require('mongoose');
const env = require('../config/env');
const ensureAdmin = require('../utils/ensureAdmin');

const seedAdmin = async () => {
  try {
    if (!env.mongoUri) {
      throw new Error('MONGO_URI is required. Add it in server/.env or hosting environment variables before running seed.');
    }
    await mongoose.connect(env.mongoUri);
    await ensureAdmin();
    process.exit(0);
  } catch (error) {
    console.error(formatSeedError(error));
    process.exit(1);
  }
};

const formatSeedError = (error) => {
  const message = error.message || String(error);
  if (message.includes('ECONNREFUSED') && message.includes('127.0.0.1:27017')) {
    return 'Local MongoDB is not running. Start MongoDB locally or set MONGO_URI to MongoDB Atlas before seeding admin.';
  }
  return message;
};

seedAdmin();
