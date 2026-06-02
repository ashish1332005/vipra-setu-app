const User = require('../models/User');

const ensureAdmin = async () => {
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
    return;
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
};

module.exports = ensureAdmin;
