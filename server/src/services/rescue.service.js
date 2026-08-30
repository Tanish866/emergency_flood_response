const RescueTeam = require('../models/RescueTeam');
const HelpRequest = require('../models/HelpRequest');
const ApiError = require('../utils/ApiError');
const { RESCUE_TEAM_STATUS, HELP_REQUEST_STATUS, SOCKET_EVENTS } = require('../utils/constants');
const { selectBestTeam } = require('../algorithms/rescueAllocation');
const notificationService = require('./notification.service');

const listRescueTeams = async () => RescueTeam.find();

const getRescueTeamById = async (id) => {
  const team = await RescueTeam.findById(id);
  if (!team) {
    throw new ApiError(404, 'Rescue team not found');
  }
  return team;
};

const findNearbyTeams = async ({ coordinates, maxDistanceKm = 30 }) => {
  return RescueTeam.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
  });
};

const findSuitableTeam = async ({ requestLocation, requiredCapabilities = [], priorityScore = 0 }) => {
  const candidates = await RescueTeam.find({ isActive: true });

  if (candidates.length === 0) {
    return null;
  }

  return selectBestTeam({
    teams: candidates,
    requestLocation,
    requiredCapabilities,
    priorityScore,
  });
};

const updateStatus = async (teamId, status) => {
  const team = await RescueTeam.findByIdAndUpdate(
    teamId,
    { status },
    { new: true, runValidators: true }
  );
  if (!team) {
    throw new ApiError(404, 'Rescue team not found');
  }
  return team;
};

const updateLocation = async (teamId, coordinates) => {
  const team = await RescueTeam.findByIdAndUpdate(
    teamId,
    { location: { type: 'Point', coordinates } },
    { new: true, runValidators: true }
  );
  if (!team) {
    throw new ApiError(404, 'Rescue team not found');
  }

  if (team.currentRequest) {
    const helpRequest = await HelpRequest.findById(team.currentRequest);
    if (helpRequest) {
      notificationService.emitToUser(helpRequest.userId.toString(), SOCKET_EVENTS.TEAM_LOCATION_UPDATED, {
        teamId: team._id,
        helpRequestId: helpRequest._id,
        coordinates,
      });
    }
  }

  return team;
};

const getTeamRequestHistory = async (teamId, limit = 50) =>
  HelpRequest.find({ assignedTeamId: teamId }).sort({ createdAt: -1 }).limit(limit);

const getTeamStatsToday = async (teamId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [requestsToday, completedToday, inProgress] = await Promise.all([
    HelpRequest.countDocuments({ assignedTeamId: teamId, createdAt: { $gte: startOfDay } }),
    HelpRequest.countDocuments({
      assignedTeamId: teamId,
      status: HELP_REQUEST_STATUS.RESOLVED,
      completedAt: { $gte: startOfDay },
    }),
    HelpRequest.countDocuments({
      assignedTeamId: teamId,
      status: { $in: [HELP_REQUEST_STATUS.ASSIGNED, HELP_REQUEST_STATUS.EN_ROUTE, HELP_REQUEST_STATUS.ON_SCENE] },
    }),
  ]);

  return { requestsToday, completedToday, inProgress };
};

const assignRequest = async (teamId, requestId) => {
  const team = await RescueTeam.findByIdAndUpdate(
    teamId,
    { status: RESCUE_TEAM_STATUS.ASSIGNED, currentRequest: requestId },
    { new: true, runValidators: true }
  );
  if (!team) {
    throw new ApiError(404, 'Rescue team not found');
  }
  return team;
};

const releaseTeam = async (teamId) => {
  const team = await RescueTeam.findByIdAndUpdate(
    teamId,
    { status: RESCUE_TEAM_STATUS.AVAILABLE, currentRequest: null },
    { new: true, runValidators: true }
  );
  if (!team) {
    throw new ApiError(404, 'Rescue team not found');
  }
  return team;
};

const updateTeamAdmin = async (id, updates) => {
  const team = await RescueTeam.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!team) {
    throw new ApiError(404, 'Rescue team not found');
  }
  return team;
};

module.exports = {
  listRescueTeams,
  getRescueTeamById,
  findNearbyTeams,
  findSuitableTeam,
  updateStatus,
  updateLocation,
  assignRequest,
  releaseTeam,
  updateTeamAdmin,
  getTeamRequestHistory,
  getTeamStatsToday,
};