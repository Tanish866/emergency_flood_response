const mongoose = require('mongoose');
const { MESSAGE_SENDER_ROLE } = require('../utils/constants');

const messageSchema = new mongoose.Schema(
  {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueTeam', required: true },
    senderRole: {
      type: String,
      enum: Object.values(MESSAGE_SENDER_ROLE),
      required: true,
    },
    senderName: { type: String, required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

messageSchema.index({ teamId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);