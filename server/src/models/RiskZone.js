const mongoose = require('mongoose');
const { RISK_LEVEL } = require('../utils/constants');

const riskZoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    geometry: {
      type: { type: String, enum: ['Polygon', 'MultiPolygon'], required: true },
      coordinates: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    riskLevel: {
      type: String,
      enum: Object.values(RISK_LEVEL),
      required: true,
    },
    affectedPopulation: { type: Number, default: 0 },
    source: { type: String, default: 'CURATED_DEMO' },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

riskZoneSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('RiskZone', riskZoneSchema);
