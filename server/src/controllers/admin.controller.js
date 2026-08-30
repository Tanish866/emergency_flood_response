const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const HelpRequest = require('../models/HelpRequest');
const RescueTeam = require('../models/RescueTeam');
const Shelter = require('../models/Shelter');
const Report = require('../models/Report');
const { HELP_REQUEST_STATUS, RESCUE_TEAM_STATUS, SOCKET_EVENTS, ROLES, NOTIFICATION_TYPE } = require('../utils/constants');
const shelterService = require('../services/shelter.service');
const rescueService = require('../services/rescue.service');
const routingService = require('../services/routing.service');
const riskService = require('../services/risk.service');
const notificationService = require('../services/notification.service');

const getDashboard = asyncHandler(async (req, res) => {
  const [activeRequests, availableTeams, totalTeams, sheltersAtCapacity, pendingReports] =
    await Promise.all([
      HelpRequest.countDocuments({
        status: { $in: [HELP_REQUEST_STATUS.PENDING, HELP_REQUEST_STATUS.ASSIGNED, HELP_REQUEST_STATUS.EN_ROUTE, HELP_REQUEST_STATUS.ON_SCENE] },
      }),
      RescueTeam.countDocuments({ status: RESCUE_TEAM_STATUS.AVAILABLE, isActive: true }),
      RescueTeam.countDocuments({ isActive: true }),
      Shelter.countDocuments({ status: 'FULL' }),
      Report.countDocuments({ status: 'PENDING' }),
    ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        activeRequests,
        availableTeams,
        totalTeams,
        sheltersAtCapacity,
        pendingReports,
      },
      'Dashboard summary fetched'
    )
  );
});

const getHelpRequests = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const requests = await HelpRequest.find(filter).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, requests, 'Help requests fetched'));
});

const getRescueTeams = asyncHandler(async (req, res) => {
  const teams = await rescueService.listRescueTeams();
  return res.status(200).json(new ApiResponse(200, teams, 'Rescue teams fetched'));
});

const getShelters = asyncHandler(async (req, res) => {
  const shelters = await shelterService.listShelters();
  return res.status(200).json(new ApiResponse(200, shelters, 'Shelters fetched'));
});

const updateRoad = asyncHandler(async (req, res) => {
  const road = await routingService.markRoadStatus(req.params.id, req.body.status);

  await notificationService.notifyRoleAndEmit({
    role: ROLES.ADMIN,
    type: NOTIFICATION_TYPE.ROUTE_CHANGED,
    title: 'Road status changed',
    message: `${road.name} is now ${road.status}.`,
    data: { roadId: road._id, status: road.status },
    event: SOCKET_EVENTS.ROAD_STATUS_CHANGED,
  });
  await notificationService.notifyRoleAndEmit({
    role: ROLES.USER,
    type: NOTIFICATION_TYPE.ROUTE_CHANGED,
    title: 'Route conditions changed',
    message: `A road near you is now ${road.status}.`,
    data: { roadId: road._id, status: road.status },
    event: SOCKET_EVENTS.ROUTE_UPDATED,
  });

  return res.status(200).json(new ApiResponse(200, road, 'Road updated'));
});

const updateShelter = asyncHandler(async (req, res) => {
  const shelter = await shelterService.updateShelterAdmin(req.params.id, req.body);

  await notificationService.notifyRoleAndEmit({
    role: ROLES.ADMIN,
    type: NOTIFICATION_TYPE.SHELTER_CHANGED,
    title: 'Shelter updated',
    message: `${shelter.name} is now ${shelter.status}.`,
    data: { shelterId: shelter._id, status: shelter.status },
    event: SOCKET_EVENTS.SHELTER_STATUS_CHANGED,
  });
  await notificationService.notifyRoleAndEmit({
    role: ROLES.USER,
    type: NOTIFICATION_TYPE.SHELTER_CHANGED,
    title: 'Shelter status changed',
    message: `${shelter.name} is now ${shelter.status}.`,
    data: { shelterId: shelter._id, status: shelter.status },
    event: SOCKET_EVENTS.SHELTER_UPDATED,
  });

  return res.status(200).json(new ApiResponse(200, shelter, 'Shelter updated'));
});

const updateRescueTeam = asyncHandler(async (req, res) => {
  const team = await rescueService.updateTeamAdmin(req.params.id, req.body);

  await notificationService.notifyRoleAndEmit({
    role: ROLES.ADMIN,
    type: NOTIFICATION_TYPE.RESCUE_STATUS_CHANGED,
    title: 'Rescue team updated',
    message: `${team.teamName} is now ${team.status}.`,
    data: { teamId: team._id, status: team.status },
    event: SOCKET_EVENTS.RESCUE_STATUS_CHANGED,
  });

  return res.status(200).json(new ApiResponse(200, team, 'Rescue team updated'));
});

const updateRiskZone = asyncHandler(async (req, res) => {
  const zone = await riskService.updateRiskZoneAdmin(req.params.id, req.body);

  await notificationService.notifyRoleAndEmit({
    role: ROLES.ADMIN,
    type: NOTIFICATION_TYPE.RISK_CHANGED,
    title: 'Risk zone updated',
    message: `${zone.name} risk level is now ${zone.riskLevel}.`,
    data: { riskZoneId: zone._id, riskLevel: zone.riskLevel },
    event: SOCKET_EVENTS.RISK_CHANGED,
  });
  await notificationService.notifyRoleAndEmit({
    role: ROLES.USER,
    type: NOTIFICATION_TYPE.RISK_CHANGED,
    title: 'Risk level changed nearby',
    message: `${zone.name} risk level is now ${zone.riskLevel}.`,
    data: { riskZoneId: zone._id, riskLevel: zone.riskLevel },
    event: SOCKET_EVENTS.RISK_UPDATED,
  });

  return res.status(200).json(new ApiResponse(200, zone, 'Risk zone updated'));
});

module.exports = {
  getDashboard,
  getHelpRequests,
  getRescueTeams,
  getShelters,
  updateRoad,
  updateShelter,
  updateRescueTeam,
  updateRiskZone,
};