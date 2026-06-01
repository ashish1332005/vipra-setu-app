const express = require('express');
const { listServices, getService } = require('../controllers/serviceController');

const router = express.Router();

router.get('/', listServices);
router.get('/:id', getService);

module.exports = router;
