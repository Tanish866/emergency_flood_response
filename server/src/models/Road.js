const mongoose = require('mongoose');
const { ROAD_STATUS, RISK_LEVEL } = require('../utils/constants');

const roadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    geometry: {
      type: { type: String, enum: ['LineString'], required: true },
      coordinates: { type: [[Number]], required: true },
    },
    status: {
      type: String,
      enum: Object.values(ROAD_STATUS),
      default: ROAD_STATUS.OPEN,
    },
    riskLevel: {
      type: String,
      enum: Object.values(RISK_LEVEL),
      default: RISK_LEVEL.LOW,
    },
    riskPenalty: { type: Number, default: 0, min: 0 },
    source: { type: String, default: 'CURATED_DEMO' },
  },
  { timestamps: true }
);

roadSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Road', roadSchema);
