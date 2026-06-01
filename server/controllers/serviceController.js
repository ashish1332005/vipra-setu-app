const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');

const listServices = asyncHandler(async (req, res) => {
  const { category, provider } = req.query;
  const filter = {
    isActive: true,
    $or: [
      { moderationStatus: 'approved' },
      { moderationStatus: { $exists: false } },
    ],
  };

  if (category) filter.category = category;
  if (provider) filter.provider = provider;

  const services = await Service.find(filter).populate('provider', 'name phone role status').sort('-createdAt');
  res.json({ services });
});

const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('provider', 'name phone role status');

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  res.json({ service });
});

module.exports = { listServices, getService };
