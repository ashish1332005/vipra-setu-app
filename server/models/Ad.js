const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Category Banner', 'Sidebar', 'Home Rail'],
      default: 'Category Banner',
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    targetUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Paused'],
      default: 'Active',
    },
    placement: {
      type: String,
      trim: true,
      default: 'all',
    },
    audienceRole: {
      type: String,
      enum: ['all', 'service_taker', 'service_provider'],
      default: 'all',
    },
    providerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProviderProfile',
    },
    providerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    ctaLabel: {
      type: String,
      trim: true,
      default: 'Know More',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ad', adSchema);
