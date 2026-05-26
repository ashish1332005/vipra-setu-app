const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const workerRoutes = require('./worker.routes');
const categoryRoutes = require('./category.routes');
const reviewRoutes = require('./review.routes');

router.use('/auth', authRoutes);
router.use('/workers', workerRoutes);
router.use('/categories', categoryRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;
