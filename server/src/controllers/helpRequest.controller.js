const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const helpRequestService = require('../services/helpRequest.service');
const RescueTeam = require('../models/RescueTeam');

const resolveActor = async (req) => {
  let teamId = req.user.teamId || null;

  if (!teamId) {
    const team = await RescueTeam.findOne({ contact: req.user.email });
    teamId = team ? team._id.toString() : null;
  }

  return { id: req.user.id, role: req.user.role, teamId };
};

const createHelpRequest = asyncHandler(async (req, res) => {
  const { location, severity, peopleCount, description } = req.body;

  const result = await helpRequestService.createHelpRequest({
    userId: req.user.id,
    location,
    severity,
    peopleCount,
    description,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, result, 'Help request created'));
});

const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await helpRequestService.getMyRequests(req.user.id);
  return res.status(200).json(new ApiResponse(200, requests, 'Your help requests fetched'));
});

const getRequestById = asyncHandler(async (req, res) => {
  const actor = await resolveActor(req);
  const helpRequest = await helpRequestService.getRequestById(req.params.id, actor);
  return res.status(200).json(new ApiResponse(200, helpRequest, 'Help request fetched'));
});

const acceptRequest = asyncHandler(async (req, res) => {
  const actor = await resolveActor(req);
  const helpRequest = await helpRequestService.acceptRequest(req.params.id, {
    id: actor.teamId,
  });
  return res.status(200).json(new ApiResponse(200, helpRequest, 'Help request accepted'));
});

const rejectRequest = asyncHandler(async (req, res) => {
  const actor = await resolveActor(req);
  const helpRequest = await helpRequestService.rejectRequest(req.params.id, {
    id: actor.teamId,
  });
  return res.status(200).json(new ApiResponse(200, helpRequest, 'Help request rejected'));
});

const updateStatus = asyncHandler(async (req, res) => {
  const actor = await resolveActor(req);
  const helpRequest = await helpRequestService.updateStatus(req.params.id, req.body.status, actor);
  return res.status(200).json(new ApiResponse(200, helpRequest, 'Help request status updated'));
});

const completeRequest = asyncHandler(async (req, res) => {
  const actor = await resolveActor(req);
  const helpRequest = await helpRequestService.completeRequest(req.params.id, actor);
  return res.status(200).json(new ApiResponse(200, helpRequest, 'Help request completed'));
});

module.exports = {
  createHelpRequest,
  getMyRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
  updateStatus,
  completeRequest,
};
