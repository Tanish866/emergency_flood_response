const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { isValidCoordinates } = require('../utils/distance');
const Report = require('../models/Report');
const { REPORT_STATUS, REPORT_TYPE, ROAD_STATUS, NOTIFICATION_TYPE, SOCKET_EVENTS, ROLES } = require('../utils/constants');
const routingService = require('../services/routing.service');
const notificationService = require('../services/notification.service');

const createReport = asyncHandler(async (req, res) => {
  const { location, type, description, image, severity } = req.body;

  const report = await Report.create({
    userId: req.user.id,
    location,
    type,
    description,
    image,
    severity,
    status: REPORT_STATUS.PENDING,
  });

  return res.status(201).json(new ApiResponse(201, report, 'Report submitted'));
});

const getNearbyReports = asyncHandler(async (req, res) => {
  const { lng, lat, maxDistanceKm } = req.query;
  const coordinates = [Number(lng), Number(lat)];

  if (!isValidCoordinates(coordinates)) {
    throw new ApiError(400, 'lng and lat query parameters must form a valid coordinate pair');
  }

  const reports = await Report.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: (maxDistanceKm ? Number(maxDistanceKm) : 15) * 1000,
      },
    },
  });

  return res.status(200).json(new ApiResponse(200, reports, 'Nearby reports fetched'));
});

const getMyReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, reports, 'Your reports fetched'));
});

const verifyReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    throw new ApiError(404, 'Report not found');
  }

  report.status = REPORT_STATUS.VERIFIED;
  report.verifiedBy = req.user.id;
  await report.save();

  if (report.type === REPORT_TYPE.ROAD_BLOCKED && req.body.roadId) {
    await routingService.markRoadStatus(req.body.roadId, ROAD_STATUS.BLOCKED);
    notificationService.emitToRole(ROLES.USER, SOCKET_EVENTS.ROUTE_UPDATED, {
      roadId: req.body.roadId,
      status: ROAD_STATUS.BLOCKED,
    });
    notificationService.emitToRole(ROLES.ADMIN, SOCKET_EVENTS.ROAD_STATUS_CHANGED, {
      roadId: req.body.roadId,
      status: ROAD_STATUS.BLOCKED,
    });
  }

  await notificationService.notifyAndEmit({
    userId: report.userId.toString(),
    type: NOTIFICATION_TYPE.REPORT_STATUS_CHANGED,
    title: 'Report verified',
    message: 'Your report has been verified by an administrator.',
    data: { reportId: report._id, status: report.status },
  });

  return res.status(200).json(new ApiResponse(200, report, 'Report verified'));
});

const rejectReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    throw new ApiError(404, 'Report not found');
  }

  report.status = REPORT_STATUS.REJECTED;
  report.verifiedBy = req.user.id;
  await report.save();

  await notificationService.notifyAndEmit({
    userId: report.userId.toString(),
    type: NOTIFICATION_TYPE.REPORT_STATUS_CHANGED,
    title: 'Report rejected',
    message: 'Your report was reviewed and rejected.',
    data: { reportId: report._id, status: report.status },
  });

  return res.status(200).json(new ApiResponse(200, report, 'Report rejected'));
});

module.exports = { createReport, getNearbyReports, getMyReports, verifyReport, rejectReport };
