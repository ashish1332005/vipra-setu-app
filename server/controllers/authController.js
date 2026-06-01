const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const crypto = require('crypto');
const env = require('../config/env');
const { sendEmail } = require('../utils/email');

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role = 'service_taker', providerProfile } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error('Name, email, phone, and password are required');
  }

  if (!['service_provider', 'service_taker'].includes(role)) {
    res.status(400);
    throw new Error('Invalid registration role');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    status: role === 'service_provider' ? 'pending' : 'active',
  });

  const verificationToken = await issueEmailVerification(user);

  if (role === 'service_provider') {
    await ProviderProfile.create({
      user: user._id,
      category: providerProfile?.category || 'Other Services',
      city: providerProfile?.city || 'Bhilwara',
      businessName: providerProfile?.businessName,
      skills: providerProfile?.skills || [],
      address: providerProfile?.address,
      experienceYears: providerProfile?.experienceYears || 0,
      rate: providerProfile?.rate,
      availability: providerProfile?.availability,
    });
  }

  res.status(201).json({
    user: sanitizeUser(user),
    token: generateToken(user),
    verificationToken: env.nodeEnv === 'production' ? undefined : verificationToken,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.status === 'banned') {
    res.status(403);
    throw new Error('Your account is banned');
  }

  res.json({
    user: sanitizeUser(user),
    token: generateToken(user),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400);
    throw new Error('Verification token is required');
  }

  const hashedToken = hashToken(token);
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }

  user.emailVerifiedAt = new Date();
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({ user: sanitizeUser(user), token: generateToken(user) });
});

const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.emailVerifiedAt) {
    res.json({ message: 'Email is already verified' });
    return;
  }

  const verificationToken = await issueEmailVerification(user);
  res.json({
    message: 'Verification email sent',
    verificationToken: env.nodeEnv === 'production' ? undefined : verificationToken,
  });
});

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  emailVerifiedAt: user.emailVerifiedAt,
  isEmailVerified: Boolean(user.emailVerifiedAt),
});

const issueEmailVerification = async (user) => {
  const token = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = hashToken(token);
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const verifyUrl = `${env.clientUrl}/login?verifyToken=${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your Vipra Sewa Setu account',
    text: `Namaste ${user.name}, verify your account using this link: ${verifyUrl}`,
  });

  return token;
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { register, login, getMe, verifyEmail, resendVerification };
