const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    bio: {
      type: String,
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Worker = mongoose.model('Worker', workerSchema);
module.exports = Worker;
