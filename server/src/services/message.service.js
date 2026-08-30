const Message = require('../models/Message');
const RescueTeam = require('../models/RescueTeam');
const ApiError = require('../utils/ApiError');
const { MESSAGE_SENDER_ROLE, ROLES, SOCKET_EVENTS } = require('../utils/constants');
const notificationService = require('./notification.service');

const assertTeamExists = async (teamId) => {
  const team = await RescueTeam.findById(teamId);
  if (!team) {
    throw new ApiError(404, 'Rescue team not found');
  }
  return team;
};

const assertCanAccessTeamChat = async (teamId, actor) => {
  if (actor.role === ROLES.ADMIN) {
    return;
  }

  if (actor.role === ROLES.RESCUE_TEAM && actor.teamId && actor.teamId === teamId) {
    return;
  }

  throw new ApiError(403, 'You do not have access to this team chat');
};

const sendMessage = async (teamId, actor, text) => {
  await assertTeamExists(teamId);
  await assertCanAccessTeamChat(teamId, actor);

  const senderRole =
    actor.role === ROLES.ADMIN ? MESSAGE_SENDER_ROLE.CONTROL_ROOM : MESSAGE_SENDER_ROLE.RESCUE_TEAM;

  const message = await Message.create({
    teamId,
    senderRole,
    senderName: actor.name,
    text,
  });

  notificationService.emitToTeam(teamId, SOCKET_EVENTS.NEW_TEAM_MESSAGE, { message });
  notificationService.emitToRole(ROLES.ADMIN, SOCKET_EVENTS.NEW_TEAM_MESSAGE, { message });

  return message;
};

const listMessages = async (teamId, actor, limit = 100) => {
  await assertTeamExists(teamId);
  await assertCanAccessTeamChat(teamId, actor);

  return Message.find({ teamId }).sort({ createdAt: 1 }).limit(limit);
};

module.exports = { sendMessage, listMessages };