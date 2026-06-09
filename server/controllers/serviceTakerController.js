const ServiceRequest = require('../models/ServiceRequest');
const Review = require('../models/Review');
const ProviderProfile = require('../models/ProviderProfile');
const SavedProvider = require('../models/SavedProvider');
const Report = require('../models/Report');
const Notification = require('../models/Notification');
const ContactLog = require('../models/ContactLog');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require('../utils/createNotification');
const saveImageUpload = require('../utils/saveImageUpload');

const createRequest = asyncHandler(async (req, res) => {
  const { provider, category, title, description, city, address, preferredDate, preferredTimeSlot, budgetLabel, sourceService, imageFile } = req.body;
  let { imageUrl = '' } = req.body;

  if (!category || !title || !description || !city) {
    res.status(400);
    throw new Error('Category, title, description, and city are required');
  }

  if (imageFile?.dataUrl) imageUrl = saveRequestImage(imageFile);

  const request = await ServiceRequest.create({
    serviceTaker: req.user._id,
    provider,
    category,
    title,
    description,
    city,
    address,
    preferredDate,
    preferredTimeSlot,
    budgetLabel,
    imageUrl,
    issueImages: imageUrl ? [imageUrl] : [],
    sourceService,
    status: provider ? 'assigned' : 'open',
  });

  if (provider) {
    await createNotification({
      user: provider,
      title: 'New direct request',
      message: `${req.user.name} sent you a ${category} request.`,
      type: 'request',
      link: '/provider/requests',
    });
  }

  res.status(201).json({ request });
});

const listMyRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequest.find({ serviceTaker: req.user._id })
    .populate('provider', 'name email phone')
    .populate('sourceService', 'title priceLabel durationLabel packageType')
    .sort('-createdAt');

  res.json({ requests });
});

const updateMyRequest = asyncHandler(async (req, res) => {
  const updates = {};
  ['provider', 'category', 'title', 'description', 'city', 'address', 'preferredDate', 'preferredTimeSlot', 'budgetLabel', 'status', 'imageUrl'].forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (req.body.imageFile?.dataUrl) {
    updates.imageUrl = saveRequestImage(req.body.imageFile);
    updates.$addToSet = { issueImages: updates.imageUrl };
  }

  if (req.body.status) {
    updates.$push = {
      statusHistory: {
        status: req.body.status,
        changedBy: req.user._id,
        note: 'Updated by service taker',
      },
    };
  }

  const request = await ServiceRequest.findOneAndUpdate(
    { _id: req.params.id, serviceTaker: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!request) {
    res.status(404);
    throw new Error('Service request not found');
  }

  res.json({ request });
});

const deleteMyRequest = asyncHandler(async (req, res) => {
  const request = await ServiceRequest.findOneAndDelete({ _id: req.params.id, serviceTaker: req.user._id });

  if (!request) {
    res.status(404);
    throw new Error('Service request not found');
  }

  res.json({ message: 'Service request deleted' });
});

const respondToQuote = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Quote status must be accepted or rejected');
  }

  const request = await ServiceRequest.findOneAndUpdate(
    { _id: req.params.id, serviceTaker: req.user._id, 'quote.status': 'sent' },
    {
      'quote.status': status,
      pipelineStage: status === 'accepted' ? 'scheduled' : 'lost',
      $push: {
        statusHistory: {
          status: 'assigned',
          changedBy: req.user._id,
          note: `Customer ${status} provider quote`,
        },
      },
    },
    { new: true, runValidators: true }
  ).populate('provider', 'name email phone');

  if (!request) {
    res.status(404);
    throw new Error('Quote not found');
  }

  if (request.provider?._id) {
    await createNotification({
      user: request.provider._id,
      title: `Quote ${status}`,
      message: `${req.user.name} ${status} your quote for ${request.title}.`,
      type: 'request',
      link: '/provider/business',
    });
  }

  res.json({ request });
});

const createReview = asyncHandler(async (req, res) => {
  const { request, rating, comment } = req.body;

  if (!request || !rating) {
    res.status(400);
    throw new Error('Request and rating are required');
  }

  const serviceRequest = await ServiceRequest.findOne({
    _id: request,
    serviceTaker: req.user._id,
    status: 'completed',
  });

  if (!serviceRequest?.provider) {
    res.status(400);
    throw new Error('Only completed assigned requests can be reviewed');
  }

  const review = await Review.create({
    request,
    provider: serviceRequest.provider,
    serviceTaker: req.user._id,
    rating,
    comment,
  });

  const aggregate = await Review.aggregate([
    { $match: { provider: serviceRequest.provider, status: 'approved' } },
    { $group: { _id: '$provider', rating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
  ]);

  if (aggregate[0]) {
    await ProviderProfile.findOneAndUpdate(
      { user: serviceRequest.provider },
      {
        rating: Number(aggregate[0].rating.toFixed(1)),
        reviewCount: aggregate[0].reviewCount,
      }
    );
  }

  await createNotification({
    user: serviceRequest.provider,
    title: 'New review received',
    message: `${req.user.name} rated your completed work ${rating}/5.`,
    type: 'review',
    link: '/provider',
  });

  res.status(201).json({ review });
});

const listReviewsForProvider = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ provider: req.params.providerId, status: 'approved' })
    .populate('serviceTaker', 'name')
    .sort('-createdAt');

  res.json({ reviews });
});

const saveProvider = asyncHandler(async (req, res) => {
  const saved = await SavedProvider.findOneAndUpdate(
    { serviceTaker: req.user._id, provider: req.params.providerId },
    { serviceTaker: req.user._id, provider: req.params.providerId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ saved });
});

const unsaveProvider = asyncHandler(async (req, res) => {
  await SavedProvider.findOneAndDelete({ serviceTaker: req.user._id, provider: req.params.providerId });
  res.json({ message: 'Provider removed from saved list' });
});

const listSavedProviders = asyncHandler(async (req, res) => {
  const savedProviders = await SavedProvider.find({ serviceTaker: req.user._id })
    .populate('provider', 'name email phone status')
    .sort('-createdAt');

  const profiles = await ProviderProfile.find({
    user: { $in: savedProviders.map((item) => item.provider?._id).filter(Boolean) },
  }).populate('user', 'name email phone status');

  res.json({ savedProviders, profiles });
});

const getRecommendations = asyncHandler(async (req, res) => {
  const recentRequests = await ServiceRequest.find({ serviceTaker: req.user._id }).sort('-createdAt').limit(5);
  const categories = [...new Set(recentRequests.map((request) => request.category).filter(Boolean))];
  const filter = { isApproved: true };
  if (categories.length > 0) filter.category = { $in: categories };

  let providers = await ProviderProfile.find(filter)
    .populate('user', 'name email phone status')
    .sort({ rating: -1, completedJobs: -1 })
    .limit(6);

  if (providers.length === 0) {
    providers = await ProviderProfile.find({ isApproved: true })
      .populate('user', 'name email phone status')
      .sort({ rating: -1, completedJobs: -1 })
      .limit(6);
  }

  res.json({ providers });
});

const createReport = asyncHandler(async (req, res) => {
  const { provider, request, reason, details } = req.body;

  if (!reason) {
    res.status(400);
    throw new Error('Reason is required');
  }

  const report = await Report.create({
    reporter: req.user._id,
    provider,
    request,
    reason,
    details,
  });

  res.status(201).json({ report });
});

const listMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(50);
  res.json({ notifications });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { readAt: new Date() },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.json({ notification });
});

const createContactLog = asyncHandler(async (req, res) => {
  const { provider, providerProfile, category, method, city = '', rateLabel = '', note = '' } = req.body;

  if (!provider || !category || !['call', 'whatsapp'].includes(method)) {
    res.status(400);
    throw new Error('Provider, category, and contact method are required');
  }

  const log = await ContactLog.create({
    serviceTaker: req.user._id,
    provider,
    providerProfile,
    category,
    method,
    city,
    rateLabel,
    note,
    source: 'mobile_app',
  });

  await createNotification({
    user: provider,
    title: method === 'call' ? 'New call lead' : 'New WhatsApp lead',
    message: `${req.user.name} contacted you for ${category}.`,
    type: 'request',
    link: '/provider/requests',
  });

  const populatedLog = await ContactLog.findById(log._id)
    .populate('serviceTaker', 'name phone')
    .populate('provider', 'name phone')
    .populate('providerProfile', 'businessName category city rate');

  res.status(201).json({ contactLog: populatedLog });
});

const listMyContactLogs = asyncHandler(async (req, res) => {
  const contactLogs = await ContactLog.find({ serviceTaker: req.user._id })
    .populate('provider', 'name phone')
    .populate('providerProfile', 'businessName category city rate')
    .sort('-createdAt')
    .limit(100);

  res.json({ contactLogs });
});

const saveRequestImage = (imageFile) => saveImageUpload(imageFile, {
  folder: 'requests',
  label: 'Request image',
  maxSizeMb: 5,
});

module.exports = {
  createRequest,
  listMyRequests,
  updateMyRequest,
  deleteMyRequest,
  respondToQuote,
  createReview,
  listReviewsForProvider,
  saveProvider,
  unsaveProvider,
  listSavedProviders,
  getRecommendations,
  createReport,
  listMyNotifications,
  markNotificationRead,
  createContactLog,
  listMyContactLogs,
};
