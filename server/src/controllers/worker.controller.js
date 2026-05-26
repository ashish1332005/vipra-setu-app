// server/src/controllers/worker.controller.js
const Worker = require('../models/Worker');

// @desc    Get all workers (For "Famous Workers" section)
// @route   GET /api/workers
const getWorkers = async (req, res) => {
  try {
    // Populate pulls in the Name and Mobile from the User schema
    const workers = await Worker.find({})
      .populate('user', 'name mobile')
      .populate('category', 'name');
    
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch workers' });
  }
};

// @desc    Get workers filtered by category
// @route   GET /api/workers/category/:categoryId
const getWorkersByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    
    const workers = await Worker.find({ category: categoryId })
      .populate('user', 'name mobile')
      .populate('category', 'name');

    if (!workers || workers.length === 0) {
      return res.status(404).json({ message: 'No workers found for this category' });
    }

    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Invalid category request' });
  }
};

// @desc    Get a single worker profile
// @route   GET /api/workers/:id
const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('user', 'name mobile')
      .populate('category', 'name');

    if (worker) {
      res.status(200).json(worker);
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWorkers, getWorkersByCategory, getWorkerById };