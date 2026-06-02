const CategoryConfig = require('../models/CategoryConfig');
const asyncHandler = require('../utils/asyncHandler');

const listPublicCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryConfig.find({ isActive: true }).sort('name');
  res.json({ categories });
});

module.exports = { listPublicCategories };
