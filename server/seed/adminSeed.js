const mongoose = require('mongoose');
const env = require('../config/env');
const ensureAdmin = require('../utils/ensureAdmin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    await ensureAdmin();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedAdmin();
