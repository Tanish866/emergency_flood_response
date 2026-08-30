const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { isValidCoordinates } = require('../utils/distance');
const rescueService = require('../services/rescue.service');
const RescueTeam = require('../models/RescueTeam');

const getTeams = asyncHandler(async (req, res) => {
  const teams = await rescueService.listRescueTeams();
  return res.status(200).json(new ApiResponse(200, teams, 'Rescue teams fetched'));
});

const getTeamById = asyncHandler(async (req, res) => {
  const team = await rescueService.getRescueTeamById(req.params.id);
  return res.status(200).json(new ApiResponse(200, team, 'Rescue team fetched'));
});

const getNearbyTeams = asyncHandler(async (req, res) => {
  const { lng, lat, maxDistanceKm } = req.query;
  const coordinates = [Number(lng), Number(lat)];

  if (!isValidCoordinates(coordinates)) {
    throw new ApiError(400, 'lng and lat query parameters must form a valid coordinate pair');
  }

  const teams = await rescueService.findNearbyTeams({
    coordinates,
    ...(maxDistanceKm ? { maxDistanceKm: Number(maxDistanceKm) } : {}),
  });

  return res.status(200).json(new ApiResponse(200, teams, 'Nearby rescue teams fetched'));
});

const resolveRequestingTeamId = async (req) => {
  if (req.user.teamId) {
    return req.user.teamId;
  }
  const team = await RescueTeam.findOne({ contact: req.user.email });
  return team ? team._id.toString() : null;
};

const updateStatus = asyncHandler(async (req, res) => {
  const teamId = await resolveRequestingTeamId(req);
  if (!teamId) {
    throw new ApiError(403, 'No rescue team is associated with this account');
  }

  const team = await rescueService.updateStatus(teamId, req.body.status);
  return res.status(200).json(new ApiResponse(200, team, 'Rescue team status updated'));
});

const updateLocation = asyncHandler(async (req, res) => {
  const teamId = await resolveRequestingTeamId(req);
  if (!teamId) {
    throw new ApiError(403, 'No rescue team is associated with this account');
  }

  const team = await rescueService.updateLocation(teamId, req.body.coordinates);
  return res.status(200).json(new ApiResponse(200, team, 'Rescue team location updated'));
});

const getMyRequests = asyncHandler(async (req, res) => {
  const teamId = await resolveRequestingTeamId(req);
  if (!teamId) {
    throw new ApiError(403, 'No rescue team is associated with this account');
  }

  const requests = await rescueService.getTeamRequestHistory(teamId);
  return res.status(200).json(new ApiResponse(200, requests, 'Rescue team request history fetched'));
});

const getMyStats = asyncHandler(async (req, res) => {
  const teamId = await resolveRequestingTeamId(req);
  if (!teamId) {
    throw new ApiError(403, 'No rescue team is associated with this account');
  }

  const stats = await rescueService.getTeamStatsToday(teamId);
  return res.status(200).json(new ApiResponse(200, stats, 'Rescue team stats fetched'));
});

module.exports = {
  getTeams,
  getTeamById,
  getNearbyTeams,
  updateStatus,
  updateLocation,
  getMyRequests,
  getMyStats,
};