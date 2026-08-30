const { registerUserSocket } = require('./user.socket');
const { registerRescueSocket } = require('./rescue.socket');
const { registerAdminSocket } = require('./admin.socket');

const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    registerUserSocket(io, socket);
    registerRescueSocket(io, socket).catch((err) => {
      console.error('Failed to register rescue socket rooms:', err);
    });
    registerAdminSocket(io, socket);

    socket.on('disconnect', () => {});
  });
};

module.exports = { registerSocketHandlers };