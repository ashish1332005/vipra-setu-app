const express = require('express');
const { listActiveAds } = require('../controllers/adController');

const router = express.Router();

router.get('/', listActiveAds);

module.exports = router;
