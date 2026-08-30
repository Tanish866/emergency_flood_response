const mongoose = require('mongoose');
const { RESCUE_TEAM_STATUS } = require('../utils/constants');

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false }
);

const rescueTeamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    location: { type: pointSchema, default: () => ({}) },
    status: {
      type: String,
      enum: Object.values(RESCUE_TEAM_STATUS),
      default: RESCUE_TEAM_STATUS.AVAILABLE,
    },
    capacity: { type: Number, required: true, min: 1 },
    equipment: { type: [String], default: [] },
    capabilities: { type: [String], default: [] },
    currentRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpRequest',
      default: null,
    },
    members: { type: [String], default: [] },
    vehicleType: { type: String, default: null },
    vehicleName: { type: String, default: null },
    fuelLevel: { type: Number, min: 0, max: 100, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

rescueTeamSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('RescueTeam', rescueTeamSchema);