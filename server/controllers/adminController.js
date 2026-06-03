const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const ServiceRequest = require('../models/ServiceRequest');
const Service = require('../models/Service');
const Review = require('../models/Review');
const Report = require('../models/Report');
const CategoryConfig = require('../models/CategoryConfig');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Ad = require('../models/Ad');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require('../utils/createNotification');

const getDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalProviders, totalTakers, pendingProviders, activeServices, openRequests, pendingServices, openReports, activeSubscriptions] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'service_provider' }),
    User.countDocuments({ role: 'service_taker' }),
    ProviderProfile.countDocuments({ isApproved: false }),
    Service.countDocuments({ isActive: true }),
    ServiceRequest.countDocuments({ status: 'open' }),
    Service.countDocuments({ moderationStatus: 'pending' }),
    Report.countDocuments({ status: { $in: ['open', 'reviewing'] } }),
    ProviderProfile.countDocuments({ 'subscription.status': 'active' }),
  ]);

  res.json({
    stats: {
      totalUsers,
      totalProviders,
      totalTakers,
      pendingProviders,
      activeServices,
      openRequests,
      pendingServices,
      openReports,
      activeSubscriptions,
    },
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const { role, status } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (status) filter.status = status;

  const users = await User.find(filter).select('-password').sort('-createdAt');
  res.json({ users });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['active', 'pending', 'banned'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ user });
});

const approveProvider = asyncHandler(async (req, res) => {
  const { note = '' } = req.body;
  const profile = await ProviderProfile.findOneAndUpdate(
    { user: req.params.id },
    { isApproved: true, approvalNote: note },
    { new: true }
  ).populate('user', 'name email phone status');

  if (!profile) {
    res.status(404);
    throw new Error('Provider profile not found');
  }

  await User.findByIdAndUpdate(req.params.id, { status: 'active' });
  await createNotification({
    user: req.params.id,
    title: 'Provider profile approved',
    message: note || 'Your provider profile is now approved and visible.',
    type: 'approval',
    link: '/provider',
  });
  res.json({ profile });
});

const rejectProvider = asyncHandler(async (req, res) => {
  const { note = 'Provider profile needs changes' } = req.body;
  const profile = await ProviderProfile.findOneAndUpdate(
    { user: req.params.id },
    { isApproved: false, approvalNote: note },
    { new: true }
  ).populate('user', 'name email phone status');

  if (!profile) {
    res.status(404);
    throw new Error('Provider profile not found');
  }

  await User.findByIdAndUpdate(req.params.id, { status: 'pending' });
  await createNotification({
    user: req.params.id,
    title: 'Provider approval needs changes',
    message: note,
    type: 'approval',
    link: '/provider/profile',
  });
  res.json({ profile });
});

const reviewProviderKyc = asyncHandler(async (req, res) => {
  const { status, note = '' } = req.body;

  if (!['verified', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid KYC status');
  }

  const profile = await ProviderProfile.findOneAndUpdate(
    { user: req.params.id },
    {
      'kyc.status': status,
      'kyc.adminNote': note,
      'kyc.reviewedAt': new Date(),
    },
    { new: true }
  ).populate('user', 'name email phone status');

  if (!profile) {
    res.status(404);
    throw new Error('Provider profile not found');
  }

  await createNotification({
    user: req.params.id,
    title: `KYC ${status}`,
    message: note || `Your KYC has been ${status}.`,
    type: 'approval',
    link: '/provider/profile',
  });
  res.json({ profile });
});

const listProviderProfiles = asyncHandler(async (req, res) => {
  const profiles = await ProviderProfile.find()
    .populate('user', 'name email phone status')
    .sort('-createdAt');
  res.json({ profiles });
});

const createProviderAccount = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    password,
    businessName = '',
    category,
    city = 'Bhilwara',
    address = '',
    skills = [],
    experienceYears = 0,
    rate = '',
    availability = 'Available',
    isApproved = true,
  } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!name || !normalizedPhone || !password || !category || !city) {
    res.status(400);
    throw new Error('Name, mobile number, password, category, and city are required');
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
    role: 'service_provider',
    status: isApproved ? 'active' : 'pending',
    emailVerifiedAt: new Date(),
  });

  const profile = await ProviderProfile.create({
    user: user._id,
    businessName,
    category,
    city,
    address,
    skills: normalizeSkills(skills),
    experienceYears,
    rate,
    availability,
    isApproved,
    approvalNote: isApproved ? 'Created and approved by admin' : 'Created by admin',
  });

  await createNotification({
    user: user._id,
    title: 'Provider account created',
    message: isApproved
      ? 'Your provider account has been created and approved by admin.'
      : 'Your provider account has been created by admin and is pending approval.',
    type: 'approval',
    link: '/provider',
  });

  const populatedProfile = await ProviderProfile.findById(profile._id)
    .populate('user', 'name email phone status');

  res.status(201).json({ user, profile: populatedProfile });
});

const listServicesAdmin = asyncHandler(async (req, res) => {
  const services = await Service.find()
    .populate('provider', 'name email phone status')
    .sort('-createdAt');
  res.json({ services });
});

const createServiceAdmin = asyncHandler(async (req, res) => {
  const {
    provider,
    title,
    category,
    description,
    priceLabel = '',
    durationLabel = '',
    packageType = 'standard',
    includes = [],
    moderationStatus = 'approved',
    moderationNote = 'Created by admin',
    isFeatured = false,
    isActive = true,
  } = req.body;

  const categoryName = String(category || '').trim();

  if (!provider || !title || !categoryName || !description) {
    res.status(400);
    throw new Error('Provider, title, category, and description are required');
  }

  if (!['pending', 'approved', 'rejected'].includes(moderationStatus)) {
    res.status(400);
    throw new Error('Invalid moderation status');
  }

  const [providerUser, categoryConfig] = await Promise.all([
    User.findOne({ _id: provider, role: 'service_provider' }),
    CategoryConfig.findOne({ name: categoryName, isActive: true }),
  ]);

  if (!providerUser) {
    res.status(404);
    throw new Error('Service provider not found');
  }

  if (!categoryConfig) {
    res.status(404);
    throw new Error('Active category not found');
  }

  const service = await Service.create({
    provider: providerUser._id,
    title,
    category: categoryName,
    description,
    priceLabel,
    durationLabel,
    packageType,
    includes: normalizeSkills(includes),
    moderationStatus,
    moderationNote,
    isFeatured,
    isActive,
  });

  await createNotification({
    user: providerUser._id,
    title: 'Service created by admin',
    message: `Admin created "${service.title}" in ${service.category}.`,
    type: 'approval',
    link: '/provider/services',
  });

  const populatedService = await Service.findById(service._id)
    .populate('provider', 'name email phone status');

  res.status(201).json({ service: populatedService });
});

const moderateService = asyncHandler(async (req, res) => {
  const { moderationStatus, moderationNote = '', isFeatured } = req.body;
  const updates = {};

  if (moderationStatus) {
    if (!['pending', 'approved', 'rejected'].includes(moderationStatus)) {
      res.status(400);
      throw new Error('Invalid moderation status');
    }
    updates.moderationStatus = moderationStatus;
    updates.moderationNote = moderationNote;
  }
  if (isFeatured !== undefined) updates.isFeatured = isFeatured;

  const service = await Service.findByIdAndUpdate(req.params.id, updates, { new: true })
    .populate('provider', 'name email phone status');

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await createNotification({
    user: service.provider._id,
    title: 'Service moderation updated',
    message: moderationNote || `Your service is ${service.moderationStatus}.`,
    type: 'approval',
    link: '/provider/services',
  });

  res.json({ service });
});

const listRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequest.find()
    .populate('serviceTaker', 'name email phone')
    .populate('provider', 'name email phone')
    .sort('-createdAt');

  res.json({ requests });
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, provider } = req.body;
  const updates = {};

  if (status) {
    if (!['open', 'assigned', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      res.status(400);
      throw new Error('Invalid request status');
    }

    updates.status = status;
    updates.$push = {
      statusHistory: {
        status,
        changedBy: req.user._id,
        note: 'Updated by admin',
      },
    };
  }

  if (provider !== undefined) updates.provider = provider || null;

  const request = await ServiceRequest.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
    .populate('serviceTaker', 'name email phone')
    .populate('provider', 'name email phone');

  if (!request) {
    res.status(404);
    throw new Error('Service request not found');
  }

  res.json({ request });
});

const listReviewsAdmin = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('provider', 'name email phone')
    .populate('serviceTaker', 'name email phone')
    .sort('-createdAt');
  res.json({ reviews });
});

const moderateReview = asyncHandler(async (req, res) => {
  const { status, adminNote = '' } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid review status');
  }

  const review = await Review.findByIdAndUpdate(req.params.id, { status, adminNote }, { new: true });

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  res.json({ review });
});

const listReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate('reporter', 'name email phone')
    .populate('provider', 'name email phone')
    .populate('request', 'title category status')
    .sort('-createdAt');
  res.json({ reports });
});

const updateReport = asyncHandler(async (req, res) => {
  const { status, adminNote = '' } = req.body;

  if (!['open', 'reviewing', 'resolved', 'dismissed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid report status');
  }

  const report = await Report.findByIdAndUpdate(req.params.id, { status, adminNote }, { new: true });

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  res.json({ report });
});

const listCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryConfig.find().sort('name');
  res.json({ categories });
});

const upsertCategory = asyncHandler(async (req, res) => {
  const { name, description, serviceTypes = [], isActive = true } = req.body;

  const categoryName = String(name || '').trim();

  if (!categoryName) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const category = await CategoryConfig.findOneAndUpdate(
    { name: categoryName },
    {
      name: categoryName,
      description,
      serviceTypes: normalizeSkills(serviceTypes),
      isActive,
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.json({ category });
});

const listSubscriptionPlans = asyncHandler(async (req, res) => {
  const plans = await SubscriptionPlan.find().sort('price');
  res.json({ plans });
});

const upsertSubscriptionPlan = asyncHandler(async (req, res) => {
  const { code, name, price, durationDays = 365, leadCredits = 120, featured = false, features = [], isActive = true } = req.body;

  if (!code || !name || price === undefined) {
    res.status(400);
    throw new Error('Plan code, name, and price are required');
  }

  const plan = await SubscriptionPlan.findOneAndUpdate(
    { code },
    { code, name, price, durationDays, leadCredits, featured, features, isActive },
    { upsert: true, new: true, runValidators: true }
  );

  res.json({ plan });
});

const listAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find()
    .populate('providerProfile', 'businessName category city rating reviewCount isApproved subscription')
    .populate('providerUser', 'name email phone role status')
    .sort('-createdAt');
  res.json({ ads });
});

const createAd = asyncHandler(async (req, res) => {
  const {
    title,
    type = 'Category Banner',
    targetUrl = '',
    status = 'Active',
    placement = 'all',
    placements,
    targetCategory = 'all',
    imageFile,
    audienceRole = 'all',
    providerProfile = '',
    subtitle = '',
    ctaLabel = 'Know More',
  } = req.body;
  let { imageUrl = '' } = req.body;
  let providerUser = undefined;

  if (providerProfile) {
    const profile = await ProviderProfile.findById(providerProfile).populate('user', 'name email phone');
    if (!profile) {
      res.status(404);
      throw new Error('Selected provider account was not found');
    }

    providerUser = profile.user?._id;
  }

  if (imageFile?.dataUrl) {
    imageUrl = saveAdImage(imageFile);
  }

  if (!title || !imageUrl) {
    res.status(400);
    throw new Error('Ad title and image are required');
  }

  const normalizedPlacements = normalizePlacements(placements, placement);

  const ad = await Ad.create({
    title,
    type,
    imageUrl,
    targetUrl,
    status,
    placement: normalizedPlacements[0] || 'all',
    placements: normalizedPlacements,
    targetCategory,
    audienceRole,
    providerProfile: providerProfile || undefined,
    providerUser,
    subtitle,
    ctaLabel,
  });
  res.status(201).json({ ad });
});

const saveAdImage = (imageFile) => {
  const { dataUrl } = imageFile;
  const match = typeof dataUrl === 'string' && dataUrl.match(/^data:([\w/+.-]+);base64,(.+)$/);

  if (!match) {
    const error = new Error('Invalid ad image upload');
    error.statusCode = 400;
    throw error;
  }

  const allowedTypes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  const extension = allowedTypes[match[1]];

  if (!extension) {
    const error = new Error('Only JPG, PNG, or WEBP ad images are allowed');
    error.statusCode = 400;
    throw error;
  }

  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 5 * 1024 * 1024) {
    const error = new Error('Ad image must be 5MB or smaller');
    error.statusCode = 400;
    throw error;
  }

  return dataUrl;
};

const updateAd = asyncHandler(async (req, res) => {
  const allowedFields = ['title', 'type', 'imageUrl', 'targetUrl', 'status', 'placement', 'placements', 'targetCategory', 'audienceRole', 'providerProfile', 'providerUser', 'subtitle', 'ctaLabel'];
  const updates = allowedFields.reduce((data, field) => {
    if (req.body[field] !== undefined) data[field] = req.body[field];
    return data;
  }, {});

  if (req.body.placements !== undefined || req.body.placement !== undefined) {
    updates.placements = normalizePlacements(req.body.placements, req.body.placement);
    updates.placement = updates.placements[0] || 'all';
  }

  const ad = await Ad.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

  if (!ad) {
    res.status(404);
    throw new Error('Ad not found');
  }

  res.json({ ad });
});

const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error('Ad not found');
  }

  res.json({ message: 'Ad deleted' });
});

const normalizePhone = (phone = '') => String(phone).replace(/\D/g, '');

const buildPhoneLoginEmail = (phone) => `${phone}@mobile.local`;

const normalizePlacements = (placements, fallback = 'all') => {
  const allowedPlacements = new Set(['all', 'home', 'services', 'category', 'dashboard']);
  const values = Array.isArray(placements) ? placements : [fallback];
  const normalized = values
    .map((value) => String(value || '').trim().toLowerCase())
    .filter((value) => allowedPlacements.has(value));

  if (normalized.includes('all')) return ['all'];
  return [...new Set(normalized)].length ? [...new Set(normalized)] : ['all'];
};

const normalizeSkills = (skills = []) => {
  if (Array.isArray(skills)) return skills.map((skill) => String(skill).trim()).filter(Boolean);
  return String(skills)
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
};

module.exports = {
  getDashboard,
  listUsers,
  updateUserStatus,
  approveProvider,
  rejectProvider,
  reviewProviderKyc,
  listProviderProfiles,
  createProviderAccount,
  listServicesAdmin,
  createServiceAdmin,
  moderateService,
  listRequests,
  updateRequestStatus,
  listReviewsAdmin,
  moderateReview,
  listReports,
  updateReport,
  listCategories,
  upsertCategory,
  listSubscriptionPlans,
  upsertSubscriptionPlan,
  listAds,
  createAd,
  updateAd,
  deleteAd,
};
