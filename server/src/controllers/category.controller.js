// server/src/controllers/category.controller.js
const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch categories' });
  }
};

// @desc    Create a new category (Admin only typically)
// @route   POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const category = await Category.create({ name, icon, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory };