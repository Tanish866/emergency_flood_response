const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notification.service');

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listForUser(req.user.id);
  return res.status(200).json(new ApiResponse(200, notifications, 'Notifications fetched'));
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(req.params.id, req.user.id);
  return res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const updatedCount = await notificationService.markAllRead(req.user.id);
  return res
    .status(200)
    .json(new ApiResponse(200, { updatedCount }, 'All notifications marked as read'));
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead };