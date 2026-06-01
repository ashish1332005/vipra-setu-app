const mongoose = require('mongoose');

const providerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    experienceYears: {
      type: Number,
      min: 0,
      default: 0,
    },
    rate: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      trim: true,
      default: 'Available',
    },
    weeklyAvailability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        isOpen: { type: Boolean, default: true },
        startTime: { type: String, trim: true, default: '09:00' },
        endTime: { type: String, trim: true, default: '18:00' },
      },
    ],
    blackoutDates: [
      {
        date: Date,
        reason: { type: String, trim: true },
      },
    ],
    responseTimeLabel: {
      type: String,
      trim: true,
      default: 'Responds within 24 hours',
    },
    portfolio: [
      {
        title: { type: String, trim: true },
        imageUrl: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],
    kyc: {
      status: {
        type: String,
        enum: ['not_submitted', 'submitted', 'verified', 'rejected'],
        default: 'not_submitted',
      },
      documentType: { type: String, trim: true },
      documentNumber: { type: String, trim: true },
      documentUrl: { type: String, trim: true },
      adminNote: { type: String, trim: true },
      submittedAt: Date,
      reviewedAt: Date,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['none', 'basic_yearly', 'pro_yearly', 'featured_yearly'],
        default: 'none',
      },
      status: {
        type: String,
        enum: ['inactive', 'trial', 'active', 'expired', 'cancelled'],
        default: 'inactive',
      },
      startsAt: Date,
      expiresAt: Date,
      leadCredits: {
        type: Number,
        min: 0,
        default: 0,
      },
      isFeatured: {
        type: Boolean,
        default: false,
      },
    },
    completedJobs: {
      type: Number,
      min: 0,
      default: 0,
    },
    businessSettings: {
      autoReply: {
        type: String,
        trim: true,
        default: 'Thanks for your request. I will contact you shortly.',
      },
      serviceAreaKm: {
        type: Number,
        min: 0,
        default: 15,
      },
      acceptsEmergency: {
        type: Boolean,
        default: false,
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvalNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
