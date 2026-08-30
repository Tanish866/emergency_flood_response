const mongoose = require('mongoose');
const { SHELTER_STATUS } = require('../utils/constants');

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false }
);

const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: pointSchema, default: () => ({}) },
    address: { type: String, default: '' },
    capacity: { type: Number, required: true, min: 0 },
    currentOccupancy: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: Object.values(SHELTER_STATUS),
      default: SHELTER_STATUS.AVAILABLE,
    },
    contact: { type: String, default: '' },
    facilities: { type: [String], default: [] },
    source: { type: String, default: 'CURATED_DEMO' },
    riskZoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'RiskZone', default: null },
  },
  { timestamps: true }
);

shelterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shelter', shelterSchema);