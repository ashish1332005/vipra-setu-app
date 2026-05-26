const express = require('express');
const cors = require('cors');

const app = express();

// Global Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://service-worker-bl7u.onrender.com',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); 

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running smoothly.' });
});

const { errorHandler } = require('./middlewares/error.middleware');

// Route Mounting
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Custom Error Handler (should be the last middleware)
app.use(errorHandler);

module.exports = app;