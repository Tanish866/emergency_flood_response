const { ROLES } = require('../utils/constants');

const registerAdminSocket = (io, socket) => {
  if (socket.user.role !== ROLES.ADMIN) {
    return;
  }

  socket.join(`user:${socket.user.id}`);
  socket.join('role:ADMIN');
};

module.exports = { registerAdminSocket };
