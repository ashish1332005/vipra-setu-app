// server/src/controllers/review.controller.js
const Review = require('../models/Review');
const Worker = require('../models/Worker');

// @desc    Add a review for a worker
// @route   POST /api/reviews
const addReview = async (req, res) => {
  try {
    const { workerId, rating, comment } = req.body;
    
    // req.user is set by the auth middleware (JWT)
    const userId = req.user._id; 

    const review = await Review.create({
      worker: workerId,
      user: userId,
      rating: Number(rating),
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a specific worker
// @route   GET /api/reviews/:workerId
const getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId })
      .populate('user', 'name');
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getWorkerReviews };