const HelpRequest = require('../models/HelpRequest');
const RescueTeam = require('../models/RescueTeam');
const ApiError = require('../utils/ApiError');
const {
  HELP_REQUEST_STATUS,
  HELP_REQUEST_TRANSITIONS,
  RESCUE_TEAM_STATUS,
  NOTIFICATION_TYPE,
  ROLES,
} = require('../utils/constants');
const { calculatePriorityScore } = require('../algorithms/priorityScoring');
const rescueService = require('./rescue.service');
const riskService = require('./risk.service');
const notificationService = require('./notification.service');
const { SOCKET_EVENTS } = require('../utils/constants');

const createHelpRequest = async ({ userId, location, severity, peopleCount, description }) => {
  const riskScore = await riskService
    .getRiskScoreNear({ coordinates: location.coordinates })
    .catch(() => 0);

  const priorityScore = calculatePriorityScore({ severity, peopleCount, riskScore });

  const helpRequest = await HelpRequest.create({
    userId,
    location,
    severity,
    peopleCount,
    description,
    priorityScore,
    status: HELP_REQUEST_STATUS.PENDING,
  });

  const bestMatch = await rescueService.findSuitableTeam({
    requestLocation: location,
    requiredCapabilities: [],
    priorityScore,
  });

  if (!bestMatch) {
    await notificationService.notifyRoleAndEmit({
      role: ROLES.ADMIN,
      type: NOTIFICATION_TYPE.NEW_HELP_REQUEST,
      title: 'New unassigned help request',
      message: 'A new help request has no available rescue team.',
      data: { helpRequestId: helpRequest._id, status: helpRequest.status, unassigned: true },
      event: SOCKET_EVENTS.NEW_HELP_REQUEST,
    });
    return { helpRequest, assignedTeam: null };
  }

  const { team } = bestMatch;

  await rescueService.assignRequest(team._id, helpRequest._id);

  helpRequest.status = HELP_REQUEST_STATUS.ASSIGNED;
  helpRequest.assignedTeamId = team._id;
  await helpRequest.save();

  await notificationService.notifyAndEmit({
    userId: userId.toString(),
    type: NOTIFICATION_TYPE.RESCUE_ASSIGNED,
    title: 'Rescue team assigned',
    message: `A rescue team has been assigned to your request.`,
    data: { helpRequestId: helpRequest._id, teamId: team._id },
    event: SOCKET_EVENTS.RESCUE_ASSIGNED,
  });

  notificationService.emitToTeam(team._id.toString(), SOCKET_EVENTS.NEW_HELP_REQUEST, {
    helpRequestId: helpRequest._id,
    location: helpRequest.location,
    severity: helpRequest.severity,
    priorityScore: helpRequest.priorityScore,
  });

  await notificationService.notifyRoleAndEmit({
    role: ROLES.ADMIN,
    type: NOTIFICATION_TYPE.NEW_HELP_REQUEST,
    title: 'New help request assigned',
    message: `A new help request was assigned to ${team.teamName}.`,
    data: { helpRequestId: helpRequest._id, status: helpRequest.status, assignedTeamId: team._id },
    event: SOCKET_EVENTS.NEW_HELP_REQUEST,
  });

  return { helpRequest, assignedTeam: team };
};

const getMyRequests = async (userId) => HelpRequest.find({ userId }).sort({ createdAt: -1 });

const getRequestById = async (id, requester) => {
  const helpRequest = await HelpRequest.findById(id);
  if (!helpRequest) {
    throw new ApiError(404, 'Help request not found');
  }

  const isOwner = helpRequest.userId.toString() === requester.id;
  const isAssignedTeam =
    helpRequest.assignedTeamId && helpRequest.assignedTeamId.toString() === requester.teamId;
  const isAdmin = requester.role === ROLES.ADMIN;

  if (!isOwner && !isAssignedTeam && !isAdmin) {
    throw new ApiError(403, 'You do not have access to this request');
  }

  return helpRequest;
};

const assertValidTransition = (current, next) => {
  const allowed = HELP_REQUEST_TRANSITIONS[current] || [];
  if (!allowed.includes(next)) {
    throw new ApiError(400, `Cannot transition help request from ${current} to ${next}`);
  }
};

const acceptRequest = async (id, team) => {
  const helpRequest = await HelpRequest.findById(id);
  if (!helpRequest) {
    throw new ApiError(404, 'Help request not found');
  }

  if (!helpRequest.assignedTeamId || helpRequest.assignedTeamId.toString() !== team.id) {
    throw new ApiError(403, 'Only the assigned rescue team can accept this request');
  }

  assertValidTransition(helpRequest.status, HELP_REQUEST_STATUS.EN_ROUTE);

  helpRequest.status = HELP_REQUEST_STATUS.EN_ROUTE;
  helpRequest.acceptedAt = new Date();
  await helpRequest.save();

  await RescueTeam.findByIdAndUpdate(team.id, { status: RESCUE_TEAM_STATUS.EN_ROUTE });

  await notificationService.notifyAndEmit({
    userId: helpRequest.userId.toString(),
    type: NOTIFICATION_TYPE.RESCUE_STATUS_CHANGED,
    title: 'Rescue team is en route',
    message: 'Your assigned rescue team is on the way.',
    data: { helpRequestId: helpRequest._id, status: helpRequest.status },
    event: SOCKET_EVENTS.RESCUE_STATUS_UPDATED,
  });

  return helpRequest;
};

const rejectRequest = async (id, team) => {
  const helpRequest = await HelpRequest.findById(id);
  if (!helpRequest) {
    throw new ApiError(404, 'Help request not found');
  }

  if (!helpRequest.assignedTeamId || helpRequest.assignedTeamId.toString() !== team.id) {
    throw new ApiError(403, 'Only the assigned rescue team can reject this request');
  }

  helpRequest.status = HELP_REQUEST_STATUS.PENDING;
  helpRequest.assignedTeamId = null;
  await helpRequest.save();

  await rescueService.releaseTeam(team.id);

  const bestMatch = await rescueService.findSuitableTeam({
    requestLocation: helpRequest.location,
    priorityScore: helpRequest.priorityScore,
  });

  if (bestMatch) {
    await rescueService.assignRequest(bestMatch.team._id, helpRequest._id);
    helpRequest.status = HELP_REQUEST_STATUS.ASSIGNED;
    helpRequest.assignedTeamId = bestMatch.team._id;
    await helpRequest.save();

    notificationService.emitToTeam(bestMatch.team._id.toString(), SOCKET_EVENTS.NEW_HELP_REQUEST, {
      helpRequestId: helpRequest._id,
    });
  }

  return helpRequest;
};

const updateStatus = async (id, newStatus, actor) => {
  const helpRequest = await HelpRequest.findById(id);
  if (!helpRequest) {
    throw new ApiError(404, 'Help request not found');
  }

  const isAssignedTeam =
    helpRequest.assignedTeamId && helpRequest.assignedTeamId.toString() === actor.teamId;
  const isAdmin = actor.role === ROLES.ADMIN;

  if (!isAssignedTeam && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to change this request status');
  }

  assertValidTransition(helpRequest.status, newStatus);

  helpRequest.status = newStatus;

  if (newStatus === HELP_REQUEST_STATUS.ON_SCENE && helpRequest.assignedTeamId) {
    await RescueTeam.findByIdAndUpdate(helpRequest.assignedTeamId, {
      status: RESCUE_TEAM_STATUS.ON_SCENE,
    });
  }

  await helpRequest.save();

  await notificationService.notifyAndEmit({
    userId: helpRequest.userId.toString(),
    type: NOTIFICATION_TYPE.RESCUE_STATUS_CHANGED,
    title: 'Emergency status updated',
    message: `Your request status changed to ${newStatus}.`,
    data: { helpRequestId: helpRequest._id, status: newStatus },
    event: SOCKET_EVENTS.RESCUE_STATUS_UPDATED,
  });

  return helpRequest;
};

const completeRequest = async (id, actor) => {
  const helpRequest = await HelpRequest.findById(id);
  if (!helpRequest) {
    throw new ApiError(404, 'Help request not found');
  }

  const isAssignedTeam =
    helpRequest.assignedTeamId && helpRequest.assignedTeamId.toString() === actor.teamId;
  const isAdmin = actor.role === ROLES.ADMIN;

  if (!isAssignedTeam && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to complete this request');
  }

  assertValidTransition(helpRequest.status, HELP_REQUEST_STATUS.RESOLVED);

  helpRequest.status = HELP_REQUEST_STATUS.RESOLVED;
  helpRequest.completedAt = new Date();
  await helpRequest.save();

  if (helpRequest.assignedTeamId) {
    await rescueService.releaseTeam(helpRequest.assignedTeamId);
  }

  await notificationService.notifyAndEmit({
    userId: helpRequest.userId.toString(),
    type: NOTIFICATION_TYPE.RESCUE_STATUS_CHANGED,
    title: 'Emergency resolved',
    message: 'Your emergency request has been marked resolved.',
    data: { helpRequestId: helpRequest._id, status: helpRequest.status },
    event: SOCKET_EVENTS.RESCUE_STATUS_UPDATED,
  });

  return helpRequest;
};

module.exports = {
  createHelpRequest,
  getMyRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
  updateStatus,
  completeRequest,
};