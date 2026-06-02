const express = require('express');
const { listPublicCategories } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', listPublicCategories);

module.exports = router;
