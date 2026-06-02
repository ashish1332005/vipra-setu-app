const Ad = require('../models/Ad');
const asyncHandler = require('../utils/asyncHandler');

const listActiveAds = asyncHandler(async (req, res) => {
  const role = (req.query.role || 'all').trim();
  const category = (req.query.category || '').trim();
  const categoryFilter = category && category !== 'all'
    ? { targetCategory: { $in: ['all', category] } }
    : { targetCategory: 'all' };
  const ads = await Ad.find({
    status: 'Active',
    audienceRole: { $in: ['all', role] },
    ...categoryFilter,
  })
    .populate('providerProfile', 'businessName category city rating reviewCount isApproved subscription')
    .populate('providerUser', 'name email phone role status')
    .collation({ locale: 'en', strength: 2 })
    .sort('-createdAt');
  res.json({ ads });
});

module.exports = { listActiveAds };
