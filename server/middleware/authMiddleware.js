const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id).select('-password');

  if (!user || user.status === 'banned') {
    res.status(401);
    throw new Error('Not authorized');
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Access denied');
  }

  next();
};

const requireVerifiedEmail = (req, res, next) => {
  if (!req.user?.emailVerifiedAt) {
    res.status(403);
    throw new Error('Please verify your email before using this feature');
  }

  next();
};

module.exports = { protect, authorize, requireVerifiedEmail };
