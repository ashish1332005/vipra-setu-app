const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller');
const { validateMobile } = require('../middlewares/validate.middleware');

router.post('/register', validateMobile, registerUser);
router.post('/login', validateMobile, loginUser);

module.exports = router;
