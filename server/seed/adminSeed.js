const mongoose = require('mongoose');
const User = require('../models/User');
const env = require('../config/env');

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    const name = process.env.ADMIN_NAME || 'Admin';
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'admin12345';

    const existingAdmin = await User.findOne({ email }).select('+password');

    if (existingAdmin) {
      existingAdmin.name = name;
      existingAdmin.password = password;
      existingAdmin.role = 'admin';
      existingAdmin.status = 'active';
      existingAdmin.emailVerifiedAt = existingAdmin.emailVerifiedAt || new Date();
      await existingAdmin.save();

      console.log(`Admin updated: ${email}`);
      process.exit(0);
    }

    await User.create({
      name,
      email,
      phone: '0000000000',
      password,
      role: 'admin',
      status: 'active',
      emailVerifiedAt: new Date(),
    });

    console.log(`Admin created: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedAdmin();
