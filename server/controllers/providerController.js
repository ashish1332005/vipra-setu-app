const ProviderProfile = require('../models/ProviderProfile');
const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');
const Review = require('../models/Review');
const ContactLog = require('../models/ContactLog');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require('../utils/createNotification');
const saveImageUpload = require('../utils/saveImageUpload');
const fs = require('fs');
const path = require('path');

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const categoryAliases = {
  electrician: ['electrician', 'electrical', 'electrical repair', 'electric'],
  'electrical repair': ['electrician', 'electrical', 'electrical repair', 'electric'],
  plumber: ['plumber', 'plumbing', 'plumbing service'],
  'ac repair': ['ac repair', 'air conditioner', 'air conditioning', 'cooling'],
  carpenter: ['carpenter', 'carpentry', 'woodwork'],
  painter: ['painter', 'painting', 'painting service'],
  cleaning: ['cleaning', 'cleaner', 'house cleaning'],
  pandit: ['pandit', 'pandit ji', 'pooja', 'puja'],
  'pandit ji': ['pandit', 'pandit ji', 'pooja', 'puja'],
  event: ['event', 'events', 'event management', 'event manager'],
  events: ['event', 'events', 'event management', 'event manager'],
  'event management': ['event', 'events', 'event management', 'event manager'],
};

const buildCategoryRegexes = (category) => {
  const normalized = String(category || '').trim().toLowerCase();
  if (!normalized || normalized === 'all') return [];

  const terms = new Set([normalized]);
  Object.entries(categoryAliases).forEach(([key, values]) => {
    if (normalized.includes(key) || key.includes(normalized)) {
      values.forEach((value) => terms.add(value));
    }
  });

  normalized
    .split(/[\s/&,-]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 2)
    .forEach((part) => terms.add(part));

  return [...terms].map((term) => new RegExp(escapeRegex(term), 'i'));
};

const getProviderUserId = (provider) => {
  const user = provider?.user;
  return (user?._id || user || '').toString();
};

const listProviders = asyncHandler(async (req, res) => {
  const { category, city, approved = 'true', nearLat, nearLng } = req.query;
  const filter = {};

  const categoryRegexes = buildCategoryRegexes(category);
  if (categoryRegexes.length) {
    filter.$or = [
      { category: { $in: categoryRegexes } },
      { skills: { $in: categoryRegexes } },
      { businessName: { $in: categoryRegexes } },
    ];
  }
  if (city) filter.city = city;
  if (approved !== 'all') filter.isApproved = approved === 'true';

  let providers = await ProviderProfile.find(filter).populate('user', 'name email phone status');

  if (categoryRegexes.length) {
    const serviceMatches = await Service.find({
      isActive: true,
      moderationStatus: { $ne: 'rejected' },
      $or: [
        { category: { $in: categoryRegexes } },
        { title: { $in: categoryRegexes } },
        { description: { $in: categoryRegexes } },
      ],
    }).distinct('provider');

    const seenProviderIds = new Set(providers.map(getProviderUserId));
    const missingProviderIds = serviceMatches
      .map((provider) => provider?.toString())
      .filter((providerId) => providerId && !seenProviderIds.has(providerId));

    if (missingProviderIds.length) {
      const serviceProviderFilter = {
        user: { $in: missingProviderIds },
      };
      if (city) serviceProviderFilter.city = city;
      if (approved !== 'all') serviceProviderFilter.isApproved = approved === 'true';

      const serviceProviders = await ProviderProfile.find(serviceProviderFilter)
        .populate('user', 'name email phone status');
      providers = [...providers, ...serviceProviders];
    }
  }

  if (approved !== 'all') {
    providers = providers.filter((provider) =>
      approved === 'true'
        ? provider.user?.status !== 'blocked'
        : true
    );
  }

  const latitude = Number(nearLat);
  const longitude = Number(nearLng);
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    providers = providers
      .map((provider) => {
        const data = provider.toObject();
        const location = data.currentLocation || {};
        data.distanceKm = Number.isFinite(location.lat) && Number.isFinite(location.lng)
          ? calculateDistanceKm(latitude, longitude, location.lat, location.lng)
          : null;
        return data;
      })
      .sort((a, b) => (a.distanceKm ?? Number.MAX_VALUE) - (b.distanceKm ?? Number.MAX_VALUE));
  }

  res.json({ providers });
});

const getMyProviderProfile = asyncHandler(async (req, res) => {
  const profile = await ProviderProfile.findOne({ user: req.user._id }).populate('user', 'name email phone status');
  res.json({ profile });
});

const updateMyProviderProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'businessName',
    'category',
    'skills',
    'city',
    'address',
    'experienceYears',
    'rate',
    'availability',
    'profileImageUrl',
    'coverImageUrl',
    'weeklyAvailability',
    'blackoutDates',
    'businessSettings',
    'responseTimeLabel',
    'portfolio',
  ];

  const updates = allowedFields.reduce((data, field) => {
    if (req.body[field] !== undefined) data[field] = req.body[field];
    return data;
  }, {});

  if (req.body.profileImageFile?.dataUrl) {
    updates.profileImageUrl = saveProviderImage(req.body.profileImageFile);
  }

  if (req.body.coverImageFile?.dataUrl) {
    updates.coverImageUrl = saveProviderImage(req.body.coverImageFile);
  }

  const profile = await ProviderProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      ...updates,
      $setOnInsert: { user: req.user._id },
    },
    { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ profile });
});

const submitMyKyc = asyncHandler(async (req, res) => {
  const { documentType, documentNumber, documentUrl, documentFile } = req.body;

  if (!documentType || !documentNumber) {
    res.status(400);
    throw new Error('Document type and number are required');
  }

  const uploadedDocumentUrl = documentFile ? saveKycDocument(req.user._id, documentFile) : documentUrl;

  const profile = await ProviderProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      kyc: {
        status: 'submitted',
        documentType,
        documentNumber,
        documentUrl: uploadedDocumentUrl,
        submittedAt: new Date(),
      },
    },
    { new: true, runValidators: true }
  );

  res.json({ profile });
});

const saveKycDocument = (userId, documentFile) => {
  const { name = 'kyc-document', dataUrl } = documentFile;
  const match = typeof dataUrl === 'string' && dataUrl.match(/^data:([\w/+.-]+);base64,(.+)$/);

  if (!match) {
    const error = new Error('Invalid KYC document upload');
    error.statusCode = 400;
    throw error;
  }

  const mimeType = match[1];
  const allowedTypes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
  };
  const extension = allowedTypes[mimeType];

  if (!extension) {
    const error = new Error('Only JPG, PNG, WEBP, or PDF KYC documents are allowed');
    error.statusCode = 400;
    throw error;
  }

  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 5 * 1024 * 1024) {
    const error = new Error('KYC document must be 5MB or smaller');
    error.statusCode = 400;
    throw error;
  }

  const uploadDir = path.join(__dirname, '..', 'uploads', 'kyc');
  fs.mkdirSync(uploadDir, { recursive: true });
  const safeName = path.basename(name).replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
  const filename = `${userId}-${Date.now()}-${safeName || `document${extension}`}`;
  const finalName = path.extname(filename) ? filename : `${filename}${extension}`;

  fs.writeFileSync(path.join(uploadDir, finalName), buffer);
  return `/uploads/kyc/${finalName}`;
};

const saveProviderImage = (imageFile) => {
  return saveImageUpload(imageFile, {
    folder: 'providers',
    label: 'Provider image',
    maxSizeMb: 5,
  });
};

const calculateDistanceKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(1));
};

const createService = asyncHandler(async (req, res) => {
  const { title, category, description, priceLabel, durationLabel, packageType, includes } = req.body;

  if (!title || !category || !description) {
    res.status(400);
    throw new Error('Title, category, and description are required');
  }

  const service = await Service.create({
    provider: req.user._id,
    title,
    category,
    description,
    priceLabel,
    durationLabel,
    packageType,
    includes,
  });

  res.status(201).json({ service });
});

const listMyServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ provider: req.user._id }).sort('-createdAt');
  res.json({ services });
});

const updateMyService = asyncHandler(async (req, res) => {
  const updates = {};
  [
    'title',
    'category',
    'description',
    'priceLabel',
    'durationLabel',
    'packageType',
    'includes',
    'isActive',
  ].forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, provider: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  res.json({ service });
});

const deleteMyService = asyncHandler(async (req, res) => {
  const service = await Service.findOneAndDelete({
    _id: req.params.id,
    provider: req.user._id,
  });

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  res.json({ message: 'Service deleted' });
});

const listAssignedRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequest.find({ provider: req.user._id }).populate('serviceTaker', 'name email phone');
  res.json({ requests });
});

const listOpenRequests = asyncHandler(async (req, res) => {
  const profile = await ProviderProfile.findOne({ user: req.user._id });
  const filter = { status: 'open' };

  const categoryRegexes = buildCategoryRegexes(profile?.category);
  if (categoryRegexes.length) filter.category = { $in: categoryRegexes };
  if (profile?.city) filter.city = profile.city;

  const requests = await ServiceRequest.find(filter)
    .populate('serviceTaker', 'name email phone')
    .sort('-createdAt');

  res.json({ requests });
});

const claimRequest = asyncHandler(async (req, res) => {
  const profile = await ProviderProfile.findOne({ user: req.user._id });

  const request = await ServiceRequest.findOneAndUpdate(
    { _id: req.params.id, status: 'open' },
    {
      provider: req.user._id,
      status: 'assigned',
      $push: {
        statusHistory: {
          status: 'assigned',
          changedBy: req.user._id,
          note: 'Provider claimed this lead',
        },
      },
    },
    { new: true, runValidators: true }
  ).populate('serviceTaker', 'name email phone');

  if (!request) {
    res.status(404);
    throw new Error('Open request not found');
  }

  await createNotification({
    user: request.serviceTaker?._id || request.serviceTaker,
    title: 'Provider assigned',
    message: `${req.user.name} claimed your service request.`,
    type: 'request',
    link: '/taker/requests',
  });

  res.json({ request });
});

const updateAssignedRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['assigned', 'in_progress', 'completed', 'cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Invalid request status');
  }

  const request = await ServiceRequest.findOneAndUpdate(
    { _id: req.params.id, provider: req.user._id },
    {
      status,
      $push: {
        statusHistory: {
          status,
          changedBy: req.user._id,
          note: `Provider moved request to ${status}`,
        },
      },
    },
    { new: true, runValidators: true }
  ).populate('serviceTaker', 'name email phone');

  if (!request) {
    res.status(404);
    throw new Error('Assigned request not found');
  }

  if (status === 'completed') {
    await ProviderProfile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { completedJobs: 1 } }
    );
  }

  await createNotification({
    user: request.serviceTaker?._id || request.serviceTaker,
    title: 'Request updated',
    message: `Your request is now ${status}.`,
    type: 'request',
    link: '/taker/requests',
  });

  res.json({ request });
});

const updateLeadPipeline = asyncHandler(async (req, res) => {
  const { pipelineStage, priority, nextFollowUpAt, note } = req.body;
  const updates = {};

  if (pipelineStage) {
    if (!['new', 'contacted', 'quoted', 'scheduled', 'won', 'lost'].includes(pipelineStage)) {
      res.status(400);
      throw new Error('Invalid pipeline stage');
    }
    updates.pipelineStage = pipelineStage;
  }

  if (priority) {
    if (!['low', 'normal', 'high', 'urgent'].includes(priority)) {
      res.status(400);
      throw new Error('Invalid priority');
    }
    updates.priority = priority;
  }

  if (nextFollowUpAt !== undefined) updates.nextFollowUpAt = nextFollowUpAt || null;
  if (note) {
    updates.$push = {
      internalNotes: {
        note,
        createdBy: req.user._id,
      },
    };
  }

  const request = await ServiceRequest.findOneAndUpdate(
    { _id: req.params.id, provider: req.user._id },
    updates,
    { new: true, runValidators: true }
  ).populate('serviceTaker', 'name email phone');

  if (!request) {
    res.status(404);
    throw new Error('Lead not found');
  }

  res.json({ request });
});

const sendQuote = asyncHandler(async (req, res) => {
  const { amount, priceLabel, scope, validUntil } = req.body;

  if (!amount && !priceLabel) {
    res.status(400);
    throw new Error('Quote amount or price label is required');
  }

  const request = await ServiceRequest.findOneAndUpdate(
    { _id: req.params.id, provider: req.user._id },
    {
      pipelineStage: 'quoted',
      quote: {
        amount,
        priceLabel,
        scope,
        validUntil,
        status: 'sent',
        sentAt: new Date(),
      },
      $push: {
        statusHistory: {
          status: 'assigned',
          changedBy: req.user._id,
          note: 'Quote sent by provider',
        },
      },
    },
    { new: true, runValidators: true }
  ).populate('serviceTaker', 'name email phone');

  if (!request) {
    res.status(404);
    throw new Error('Lead not found');
  }

  await createNotification({
    user: request.serviceTaker._id,
    title: 'Quote received',
    message: `${req.user.name} sent a quote for ${request.title}.`,
    type: 'request',
    link: '/taker/requests',
  });

  res.json({ request });
});

const getBusinessAnalytics = asyncHandler(async (req, res) => {
  const [profile, services, requests, reviews] = await Promise.all([
    ProviderProfile.findOne({ user: req.user._id }),
    Service.find({ provider: req.user._id }),
    ServiceRequest.find({ provider: req.user._id }),
    Review.find({ provider: req.user._id, status: 'approved' }),
  ]);

  const won = requests.filter((request) => request.pipelineStage === 'won' || request.status === 'completed').length;
  const quoted = requests.filter((request) => request.quote?.status === 'sent').length;
  const totalQuoteValue = requests.reduce((total, request) => total + (request.quote?.amount || 0), 0);
  const pendingFollowUps = requests.filter((request) =>
    request.nextFollowUpAt && new Date(request.nextFollowUpAt) <= new Date()
  ).length;

  res.json({
    analytics: {
      liveServices: services.filter((service) => service.isActive).length,
      totalLeads: requests.length,
      openLeads: requests.filter((request) => !['completed', 'cancelled'].includes(request.status)).length,
      quoted,
      won,
      conversionRate: requests.length ? Math.round((won / requests.length) * 100) : 0,
      totalQuoteValue,
      pendingFollowUps,
      rating: profile?.rating || 0,
      reviewCount: reviews.length,
    },
  });
});

const listMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ provider: req.user._id })
    .populate('serviceTaker', 'name')
    .sort('-createdAt');

  res.json({ reviews });
});

const listMyContactLogs = asyncHandler(async (req, res) => {
  const contactLogs = await ContactLog.find({ provider: req.user._id })
    .populate('serviceTaker', 'name phone')
    .populate('providerProfile', 'businessName category city rate')
    .sort('-createdAt')
    .limit(100);

  res.json({ contactLogs });
});

const updateMyLocation = asyncHandler(async (req, res) => {
  const { lat, lng, accuracy, locationSharing = true } = req.body;
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    res.status(400);
    throw new Error('Latitude and longitude are required');
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    res.status(400);
    throw new Error('Invalid location coordinates');
  }

  const profile = await ProviderProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      locationSharing: Boolean(locationSharing),
      currentLocation: {
        lat: latitude,
        lng: longitude,
        accuracy: Number.isFinite(Number(accuracy)) ? Number(accuracy) : undefined,
        updatedAt: new Date(),
      },
    },
    { new: true, runValidators: true }
  ).populate('user', 'name email phone status');

  if (!profile) {
    res.status(404);
    throw new Error('Provider profile not found');
  }

  res.json({ profile });
});

module.exports = {
  listProviders,
  getMyProviderProfile,
  updateMyProviderProfile,
  submitMyKyc,
  createService,
  listMyServices,
  updateMyService,
  deleteMyService,
  listAssignedRequests,
  listOpenRequests,
  claimRequest,
  updateAssignedRequestStatus,
  updateLeadPipeline,
  sendQuote,
  getBusinessAnalytics,
  listMyReviews,
  listMyContactLogs,
  updateMyLocation,
};
