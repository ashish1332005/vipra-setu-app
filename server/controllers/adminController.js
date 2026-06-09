const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const ServiceRequest = require('../models/ServiceRequest');
const Service = require('../models/Service');
const Review = require('../models/Review');
const Report = require('../models/Report');
const CategoryConfig = require('../models/CategoryConfig');
const Ad = require('../models/Ad');
const ContactLog = require('../models/ContactLog');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require('../utils/createNotification');
const saveImageUpload = require('../utils/saveImageUpload');

const getDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalProviders, totalTakers, pendingProviders, activeServices, openRequests, pendingServices, openReports, contactLogs] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'service_provider' }),
    User.countDocuments({ role: 'service_taker' }),
    ProviderProfile.countDocuments({ isApproved: false }),
    Service.countDocuments({ isActive: true }),
    ServiceRequest.countDocuments({ status: 'open' }),
    Service.countDocuments({ moderationStatus: 'pending' }),
    Report.countDocuments({ status: { $in: ['open', 'reviewing'] } }),
    ContactLog.countDocuments(),
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
      contactLogs,
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
    profileImageUrl = '',
    coverImageUrl = '',
    skills = [],
    experienceYears = 0,
    rate = '',
    availability = 'Available',
    isApproved = true,
    profileImageFile,
    coverImageFile,
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

  const finalProfileImageUrl = profileImageFile?.dataUrl
    ? saveProviderImage(profileImageFile)
    : profileImageUrl;
  const finalCoverImageUrl = coverImageFile?.dataUrl
    ? saveProviderImage(coverImageFile)
    : coverImageUrl;

  const profile = await ProviderProfile.create({
    user: user._id,
    businessName,
    category,
    city,
    address,
    profileImageUrl: finalProfileImageUrl,
    coverImageUrl: finalCoverImageUrl,
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

const updateProviderProfileAdmin = asyncHandler(async (req, res) => {
  const profile = await ProviderProfile.findById(req.params.id).populate('user', 'name email phone status');

  if (!profile) {
    res.status(404);
    throw new Error('Provider profile not found');
  }

  const userUpdates = {};
  if (req.body.name !== undefined) userUpdates.name = req.body.name;
  if (req.body.phone !== undefined) {
    const normalizedPhone = normalizePhone(req.body.phone);
    if (!normalizedPhone) {
      res.status(400);
      throw new Error('Mobile number is required');
    }

    const duplicateUser = await User.findOne({
      phone: normalizedPhone,
      _id: { $ne: profile.user?._id },
    });
    if (duplicateUser) {
      res.status(409);
      throw new Error('Mobile number is already registered');
    }

    userUpdates.phone = normalizedPhone;
    userUpdates.email = buildPhoneLoginEmail(normalizedPhone);
  }
  if (req.body.password) userUpdates.password = req.body.password;
  if (req.body.isApproved !== undefined) {
    userUpdates.status = req.body.isApproved ? 'active' : 'pending';
  }

  const allowedFields = [
    'businessName',
    'category',
    'city',
    'address',
    'experienceYears',
    'rate',
    'availability',
    'profileImageUrl',
    'coverImageUrl',
    'isApproved',
  ];
  const profileUpdates = allowedFields.reduce((data, field) => {
    if (req.body[field] !== undefined) data[field] = req.body[field];
    return data;
  }, {});

  if (req.body.skills !== undefined) profileUpdates.skills = normalizeSkills(req.body.skills);
  if (req.body.profileImageFile?.dataUrl) {
    profileUpdates.profileImageUrl = saveProviderImage(req.body.profileImageFile);
  }
  if (req.body.coverImageFile?.dataUrl) {
    profileUpdates.coverImageUrl = saveProviderImage(req.body.coverImageFile);
  }

  if (Object.keys(userUpdates).length) {
    await User.findByIdAndUpdate(profile.user?._id, userUpdates, { runValidators: true });
  }

  const updatedProfile = await ProviderProfile.findByIdAndUpdate(
    profile._id,
    profileUpdates,
    { new: true, runValidators: true }
  ).populate('user', 'name email phone status');

  res.json({ profile: updatedProfile });
});

const deleteProviderProfileAdmin = asyncHandler(async (req, res) => {
  const profile = await ProviderProfile.findById(req.params.id);

  if (!profile) {
    res.status(404);
    throw new Error('Provider profile not found');
  }

  const userId = profile.user;
  await ProviderProfile.findByIdAndDelete(profile._id);
  if (userId) {
    await User.findByIdAndDelete(userId);
  }

  res.json({ message: 'Provider account deleted' });
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

const listContactLogs = asyncHandler(async (req, res) => {
  const { method, category } = req.query;
  const filter = {};
  if (method) filter.method = method;
  if (category) filter.category = category;

  const contactLogs = await ContactLog.find(filter)
    .populate('serviceTaker', 'name phone')
    .populate('provider', 'name phone')
    .populate('providerProfile', 'businessName category city rate')
    .sort('-createdAt')
    .limit(250);

  res.json({ contactLogs });
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
  const {
    name,
    description,
    serviceTypes = [],
    isActive = true,
    imageFile,
    iconFile,
  } = req.body;
  let { imageUrl, iconUrl } = req.body;

  const categoryName = String(name || '').trim();

  if (!categoryName) {
    res.status(400);
    throw new Error('Category name is required');
  }

  if (imageFile?.dataUrl) imageUrl = saveCategoryImage(imageFile);
  if (iconFile?.dataUrl) iconUrl = saveCategoryImage(iconFile);

  const updates = {
    name: categoryName,
    description,
    serviceTypes: normalizeSkills(serviceTypes),
    isActive,
  };
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (iconUrl !== undefined) updates.iconUrl = iconUrl;

  const category = await CategoryConfig.findOneAndUpdate(
    { name: categoryName },
    updates,
    { upsert: true, new: true, runValidators: true }
  );

  res.json({ category });
});

const listAds = asyncHandler(async (req, res) => {
  const ads = await getPopulatedAds();
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
  const providerUser = await resolveProviderUser(providerProfile);

  imageUrl = normalizeUploadedAdImage(imageUrl, imageFile);

  if (!title) {
    res.status(400);
    throw new Error('Ad title is required');
  }

  if (!imageUrl) {
    imageUrl = buildDefaultAdImage(title, subtitle);
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
  const populatedAd = await getPopulatedAd(ad._id);
  res.status(201).json({ ad: populatedAd });
});

const saveAdImage = (imageFile) => {
  return saveImageUpload(imageFile, {
    folder: 'ads',
    label: 'Ad image',
    maxSizeMb: 5,
  });
};

const normalizeUploadedAdImage = (imageUrl = '', imageFile) => {
  if (imageFile?.dataUrl) return saveAdImage(imageFile);
  if (
    typeof imageUrl === 'string' &&
    imageUrl.startsWith('data:image/') &&
    !imageUrl.startsWith('data:image/svg')
  ) {
    return saveAdImage({
      name: 'ad-image',
      dataUrl: imageUrl,
    });
  }
  return imageUrl;
};

const saveCategoryImage = (imageFile) => {
  return saveImageUpload(imageFile, {
    folder: 'categories',
    label: 'Category image',
    maxSizeMb: 3,
  });
};

const buildDefaultAdImage = (title, subtitle = '') => {
  const escapeXml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520" viewBox="0 0 1200 520">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#FF6B35"/>
          <stop offset="0.55" stop-color="#E9562B"/>
          <stop offset="1" stop-color="#1F2A44"/>
        </linearGradient>
        <pattern id="p" width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M36 6 L66 36 L36 66 L6 36 Z" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="3"/>
        </pattern>
      </defs>
      <rect width="1200" height="520" rx="46" fill="url(#g)"/>
      <rect width="1200" height="520" fill="url(#p)" opacity=".45"/>
      <circle cx="1020" cy="110" r="120" fill="rgba(255,255,255,.16)"/>
      <circle cx="1050" cy="390" r="170" fill="rgba(255,255,255,.1)"/>
      <text x="82" y="210" fill="#fff" font-family="Arial, sans-serif" font-size="68" font-weight="800">${escapeXml(title).slice(0, 42)}</text>
      <text x="86" y="286" fill="#FFEAD8" font-family="Arial, sans-serif" font-size="34" font-weight="700">${escapeXml(subtitle || 'Vipra Sewa Setu community update').slice(0, 72)}</text>
      <rect x="86" y="340" width="210" height="64" rx="32" fill="#fff"/>
      <text x="132" y="382" fill="#FF6B35" font-family="Arial, sans-serif" font-size="25" font-weight="800">Know More</text>
    </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

const saveProviderImage = (imageFile) => {
  return saveImageUpload(imageFile, {
    folder: 'providers',
    label: 'Provider image',
    maxSizeMb: 5,
  });
};

const updateAd = asyncHandler(async (req, res) => {
  const { imageFile } = req.body;
  const allowedFields = ['title', 'type', 'imageUrl', 'targetUrl', 'status', 'placement', 'placements', 'targetCategory', 'audienceRole', 'subtitle', 'ctaLabel'];
  const updates = allowedFields.reduce((data, field) => {
    if (req.body[field] !== undefined) data[field] = req.body[field];
    return data;
  }, {});

  if (imageFile?.dataUrl || String(req.body.imageUrl || '').startsWith('data:image/')) {
    updates.imageUrl = normalizeUploadedAdImage(req.body.imageUrl, imageFile);
  }

  if (req.body.placements !== undefined || req.body.placement !== undefined) {
    updates.placements = normalizePlacements(req.body.placements, req.body.placement);
    updates.placement = updates.placements[0] || 'all';
  }

  if (req.body.providerProfile !== undefined) {
    updates.providerProfile = req.body.providerProfile || null;
    updates.providerUser = await resolveProviderUser(req.body.providerProfile);
  }

  const ad = await Ad.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

  if (!ad) {
    res.status(404);
    throw new Error('Ad not found');
  }

  const populatedAd = await getPopulatedAd(ad._id);
  res.json({ ad: populatedAd });
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

const getPopulatedAds = () => Ad.find()
  .populate('providerProfile', 'businessName category city rating reviewCount isApproved')
  .populate('providerUser', 'name email phone role status')
  .sort('-createdAt');

const getPopulatedAd = (id) => Ad.findById(id)
  .populate('providerProfile', 'businessName category city rating reviewCount isApproved')
  .populate('providerUser', 'name email phone role status');

const resolveProviderUser = async (providerProfile) => {
  if (!providerProfile) return null;

  const profile = await ProviderProfile.findById(providerProfile).populate('user', 'name email phone');
  if (!profile) {
    const error = new Error('Selected provider account was not found');
    error.statusCode = 404;
    throw error;
  }

  return profile.user?._id;
};

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
  updateProviderProfileAdmin,
  deleteProviderProfileAdmin,
  listServicesAdmin,
  createServiceAdmin,
  moderateService,
  listRequests,
  listContactLogs,
  updateRequestStatus,
  listReviewsAdmin,
  moderateReview,
  listReports,
  updateReport,
  listCategories,
  upsertCategory,
  listAds,
  createAd,
  updateAd,
  deleteAd,
};
