// server/src/middlewares/validate.middleware.js

// Middleware to ensure the mobile number is exactly 10 digits
const validateMobile = (req, res, next) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  // Simple Regex to check if it's exactly 10 digits long
  const mobileRegex = /^[0-9]{10}$/;

  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
  }

  next();
};

module.exports = { validateMobile };