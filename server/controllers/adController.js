const Ad = require('../models/Ad');
const asyncHandler = require('../utils/asyncHandler');

const listActiveAds = asyncHandler(async (req, res) => {
  const role = (req.query.role || 'all').trim();
  const category = (req.query.category || '').trim();
  const placement = (req.query.placement || '').trim().toLowerCase();
  const categoryFilter = category && category !== 'all'
    ? { targetCategory: { $in: ['all', category] } }
    : {};
  const placementFilter = placement && placement !== 'all'
    ? {
        $or: [
          { placements: 'all' },
          { placements: placement },
          { placements: { $exists: false }, placement: { $in: ['all', placement] } },
        ],
      }
    : {};

  const ads = await Ad.find({
    status: 'Active',
    audienceRole: { $in: ['all', role] },
    ...categoryFilter,
    ...placementFilter,
  })
    .populate('providerProfile', 'businessName category city rating reviewCount isApproved')
    .populate('providerUser', 'name email phone role status')
    .collation({ locale: 'en', strength: 2 })
    .sort('-createdAt');
  res.json({ ads });
});

module.exports = { listActiveAds };
