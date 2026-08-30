const { ROLES } = require('../utils/constants');

const registerUserSocket = (io, socket) => {
  if (socket.user.role !== ROLES.USER) {
    return;
  }

  socket.join(`user:${socket.user.id}`);
};

module.exports = { registerUserSocket };
