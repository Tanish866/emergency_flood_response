const mongoose = require('mongoose');
const {
  HELP_REQUEST_SEVERITY,
  HELP_REQUEST_STATUS,
} = require('../utils/constants');

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const helpRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: pointSchema, required: true },
    severity: {
      type: String,
      enum: Object.values(HELP_REQUEST_SEVERITY),
      required: true,
    },
    peopleCount: { type: Number, required: true, min: 1 },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(HELP_REQUEST_STATUS),
      default: HELP_REQUEST_STATUS.PENDING,
    },
    assignedTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RescueTeam',
      default: null,
    },
    priorityScore: { type: Number, default: 0 },
    acceptedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

helpRequestSchema.index({ location: '2dsphere' });
helpRequestSchema.index({ status: 1 });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
