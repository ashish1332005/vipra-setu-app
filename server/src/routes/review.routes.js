const express = require('express');
const router = express.Router();
const { addReview, getWorkerReviews } = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, addReview);
router.get('/:workerId', getWorkerReviews);

module.exports = router;
