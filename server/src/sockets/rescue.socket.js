const { ROLES } = require('../utils/constants');
const RescueTeam = require('../models/RescueTeam');

const registerRescueSocket = async (io, socket) => {
  if (socket.user.role !== ROLES.RESCUE_TEAM) {
    return;
  }

  socket.join(`user:${socket.user.id}`);
  socket.join('role:RESCUE_TEAM');

  const team = await RescueTeam.findOne({ contact: socket.user.email });
  if (team) {
    socket.join(`team:${team._id.toString()}`);
  }
};

module.exports = { registerRescueSocket };