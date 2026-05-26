const express = require('express');
const router = express.Router();
const { getWorkers, getWorkersByCategory, getWorkerById } = require('../controllers/worker.controller');

router.get('/', getWorkers);
router.get('/category/:categoryId', getWorkersByCategory);
router.get('/:id', getWorkerById);

module.exports = router;
