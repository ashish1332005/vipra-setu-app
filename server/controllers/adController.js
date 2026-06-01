const Ad = require('../models/Ad');
const asyncHandler = require('../utils/asyncHandler');

const listActiveAds = asyncHandler(async (req, res) => {
  const role = req.query.role || 'all';
  const ads = await Ad.find({
    status: 'Active',
    audienceRole: { $in: ['all', role] },
  })
    .populate('providerProfile', 'businessName category city rating reviewCount isApproved subscription')
    .populate('providerUser', 'name email phone role status')
    .sort('-createdAt');
  res.json({ ads });
});

module.exports = { listActiveAds };
