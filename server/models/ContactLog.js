const mongoose = require('mongoose');

const contactLogSchema = new mongoose.Schema(
  {
    serviceTaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProviderProfile',
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    method: {
      type: String,
      enum: ['call', 'whatsapp'],
      required: true,
    },
    city: {
      type: String,
      trim: true,
    },
    rateLabel: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['mobile_app', 'web_app', 'admin'],
      default: 'mobile_app',
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

contactLogSchema.index({ serviceTaker: 1, createdAt: -1 });
contactLogSchema.index({ provider: 1, createdAt: -1 });
contactLogSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('ContactLog', contactLogSchema);
