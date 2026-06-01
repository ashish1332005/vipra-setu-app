const mongoose = require('mongoose');

const savedProviderSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

savedProviderSchema.index({ serviceTaker: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model('SavedProvider', savedProviderSchema);
