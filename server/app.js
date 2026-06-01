const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const providerRoutes = require('./routes/providerRoutes');
const serviceTakerRoutes = require('./routes/serviceTakerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adRoutes = require('./routes/adRoutes');

const app = express();
const allowedOrigins = new Set([
  env.clientUrl,
  ...env.clientUrls,
  'https://vipra-setu-1.onrender.com',
  'capacitor://localhost',
  'http://localhost',
  'https://localhost',
]);

app.use(cors({
  origin(origin, callback) {
    if (
      !origin ||
      env.nodeEnv !== 'production' ||
      allowedOrigins.has(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Vipra Setu API is running',
    health: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Service Worker API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/service-takers', serviceTakerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ads', adRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
