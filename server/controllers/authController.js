const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const crypto = require('crypto');
const env = require('../config/env');
const { sendEmail } = require('../utils/email');

const register = asyncHandler(async (req, res) => {
  const { name, phone, password, role = 'service_taker', providerProfile } = req.body;

  const normalizedPhone = normalizePhone(phone);

  if (!name || !normalizedPhone || !password) {
    res.status(400);
    throw new Error('Name, mobile number, and password are required');
  }

  if (!['service_provider', 'service_taker'].includes(role)) {
    res.status(400);
    throw new Error('Invalid registration role');
  }

  const existingUser = await User.findOne({ phone: normalizedPhone });
  if (existingUser) {
    res.status(409);
    throw new Error('Mobile number is already registered');
  }

  const user = await User.create({
    name,
    email: buildPhoneLoginEmail(normalizedPhone),
    phone: normalizedPhone,
    password,
    role,
    status: role === 'service_provider' ? 'pending' : 'active',
    emailVerifiedAt: new Date(),
  });

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
    message: 'Account created successfully.',
  });
});

const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone || !password) {
    res.status(400);
    throw new Error('Mobile number and password are required');
  }

  const user = await User.findOne({ phone: normalizedPhone }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid mobile number or password');
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
    res.json({ message: 'Email verification is currently disabled' });
    return;
  }

  res.json({
    message: 'Email verification is currently disabled',
  });
});

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: isPhoneLoginEmail(user.email) ? '' : user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  emailVerifiedAt: user.emailVerifiedAt,
  isEmailVerified: Boolean(user.emailVerifiedAt),
});

const normalizePhone = (phone = '') => String(phone).replace(/\D/g, '');

const buildPhoneLoginEmail = (phone) => `${phone}@mobile.local`;

const isPhoneLoginEmail = (email = '') => email.endsWith('@mobile.local');

const issueEmailVerification = async (user) => {
  const token = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = hashToken(token);
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const verifyUrl = `${env.clientUrl}/login?verifyToken=${token}`;
  const safeName = escapeHtml(user.name);
  const safeVerifyUrl = escapeHtml(verifyUrl);
  await sendEmail({
    to: user.email,
    subject: 'Verify your Vipra Sewa Setu account',
    text: [
      `Namaste ${user.name},`,
      '',
      'Please verify your Vipra Sewa Setu account using this secure link:',
      verifyUrl,
      '',
      'This link will expire in 24 hours. If you did not create this account, you can ignore this email.',
    ].join('\n'),
    html: `
      <div style="margin:0;padding:28px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
          <div style="padding:24px 26px;background:#7f1d1d;color:#ffffff;">
            <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#fde68a;">Dharma | Seva | Samaj</div>
            <h1 style="margin:10px 0 0;font-size:26px;line-height:1.25;">Verify your Vipra Sewa Setu account</h1>
          </div>
          <div style="padding:26px;">
            <p style="margin:0 0 14px;font-size:16px;line-height:1.7;">Namaste ${safeName},</p>
            <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#475569;">Click the button below to verify your email and activate your account. This keeps community requests, providers, and dashboards trusted.</p>
            <a href="${safeVerifyUrl}" style="display:inline-block;background:#facc15;color:#111827;text-decoration:none;font-weight:800;border-radius:12px;padding:14px 20px;">Verify Email</a>
            <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#64748b;">This link expires in 24 hours. If the button does not work, copy this link into your browser:<br>${safeVerifyUrl}</p>
          </div>
        </div>
      </div>
    `,
  });

  return token;
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

module.exports = { register, login, getMe, verifyEmail, resendVerification };
