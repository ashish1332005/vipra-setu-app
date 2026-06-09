const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const CategoryConfig = require('../models/CategoryConfig');

const seedLocalDev = async () => {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI is required before seeding local data.');
  }

  await mongoose.connect(env.mongoUri);

  await upsertUser({
    name: 'Admin',
    phone: process.env.ADMIN_PHONE || '0000000000',
    password: process.env.ADMIN_PASSWORD || 'admin12345',
    role: 'admin',
  });

  const provider = await upsertUser({
    name: 'Aman Sharma',
    phone: process.env.DEV_PROVIDER_PHONE || '9521066616',
    password: process.env.DEV_PROVIDER_PASSWORD || '1234567890',
    role: 'service_provider',
  });

  await ProviderProfile.findOneAndUpdate(
    { user: provider._id },
    {
      user: provider._id,
      businessName: 'Aman Services',
      category: 'Electrician',
      city: 'Bhilwara',
      address: 'Bhilwara, Rajasthan',
      rate: 'Discuss on call',
      availability: 'Available',
      isApproved: true,
      skills: ['Electrical Repair', 'AC Repair'],
    },
    { upsert: true, new: true }
  );

  for (const name of ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Repair', 'Cleaning']) {
    await CategoryConfig.findOneAndUpdate(
      { name },
      { name, description: `${name} services`, isActive: true },
      { upsert: true }
    );
  }

  console.log('Local dev data seeded.');
  await mongoose.disconnect();
};

const upsertUser = async ({ name, phone, password, role }) => {
  const user = await User.findOne({ phone }).select('+password');
  if (user) {
    user.name = name;
    user.password = password;
    user.role = role;
    user.status = 'active';
    user.email = `${phone}@mobile.local`;
    user.emailVerifiedAt = user.emailVerifiedAt || new Date();
    await user.save();
    return user;
  }

  return User.create({
    name,
    phone,
    password,
    role,
    status: 'active',
    email: `${phone}@mobile.local`,
    emailVerifiedAt: new Date(),
  });
};

seedLocalDev()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
