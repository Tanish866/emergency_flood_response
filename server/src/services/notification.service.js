const Notification = require('../models/Notification');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { getIO } = require('../config/socket');

const createNotification = async ({ userId, type, title, message, data = {}, link = null }) => {
  const notification = await Notification.create({ userId, type, title, message, data, link });
  return notification;
};

const emitToUser = (userId, event, payload) => {
  try {
    getIO().to(`user:${userId}`).emit(event, payload);
  } catch (err) {
    console.warn(`Socket emit skipped (io not ready): ${event}`);
  }
};

const emitToRole = (role, event, payload) => {
  try {
    getIO().to(`role:${role}`).emit(event, payload);
  } catch (err) {
    console.warn(`Socket emit skipped (io not ready): ${event}`);
  }
};

const emitToTeam = (teamId, event, payload) => {
  try {
    getIO().to(`team:${teamId}`).emit(event, payload);
  } catch (err) {
    console.warn(`Socket emit skipped (io not ready): ${event}`);
  }
};

const notifyAndEmit = async ({ userId, type, title, message, data = {}, link = null, event }) => {
  const notification = await createNotification({ userId, type, title, message, data, link });

  if (event) {
    emitToUser(userId, event, { notification, ...data });
  }

  return notification;
};

const notifyRoleAndEmit = async ({ role, type, title, message, data = {}, link = null, event }) => {
  const recipients = await User.find({ role, isActive: true }).select('_id');

  if (recipients.length > 0) {
    await Notification.insertMany(
      recipients.map((recipient) => ({
        userId: recipient._id,
        type,
        title,
        message,
        data,
        link,
      }))
    );
  }

  if (event) {
    emitToRole(role, event, { title, message, ...data });
  }

  return recipients.length;
};

const listForUser = async (userId) => Notification.find({ userId }).sort({ createdAt: -1 });

const markRead = async (id, userId) => {
  const notification = await Notification.findOne({ _id: id, userId });
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

const markAllRead = async (userId) => {
  const result = await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return result.modifiedCount || 0;
};

module.exports = {
  createNotification,
  emitToUser,
  emitToRole,
  emitToTeam,
  notifyAndEmit,
  notifyRoleAndEmit,
  listForUser,
  markRead,
  markAllRead,
};