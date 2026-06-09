const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    serviceTaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    preferredDate: {
      type: Date,
    },
    preferredTimeSlot: {
      type: String,
      trim: true,
    },
    budgetLabel: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    issueImages: [
      {
        type: String,
        trim: true,
      },
    ],
    sourceService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'],
      default: 'open',
    },
    pipelineStage: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'scheduled', 'won', 'lost'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    quote: {
      amount: { type: Number, min: 0 },
      priceLabel: { type: String, trim: true },
      scope: { type: String, trim: true },
      validUntil: Date,
      status: {
        type: String,
        enum: ['not_sent', 'sent', 'accepted', 'rejected'],
        default: 'not_sent',
      },
      sentAt: Date,
    },
    nextFollowUpAt: Date,
    internalNotes: [
      {
        note: { type: String, required: true, trim: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'],
          required: true,
        },
        note: { type: String, trim: true },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now },
      },
    ],
    adminNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

serviceRequestSchema.pre('save', function addInitialHistory(next) {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      changedBy: this.serviceTaker,
      note: this.provider ? 'Direct booking request created' : 'Open request created',
    });
  }
  next();
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
