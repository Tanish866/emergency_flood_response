const mongoose = require('mongoose');
const {
  REPORT_TYPE,
  REPORT_STATUS,
  HELP_REQUEST_SEVERITY,
} = require('../utils/constants');

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: pointSchema, required: true },
    type: {
      type: String,
      enum: Object.values(REPORT_TYPE),
      required: true,
    },
    description: { type: String, default: '' },
    image: { type: String, default: null },
    severity: {
      type: String,
      enum: Object.values(HELP_REQUEST_SEVERITY),
      default: HELP_REQUEST_SEVERITY.LOW,
    },
    status: {
      type: String,
      enum: Object.values(REPORT_STATUS),
      default: REPORT_STATUS.PENDING,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

reportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Report', reportSchema);
