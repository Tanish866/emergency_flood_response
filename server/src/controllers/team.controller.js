const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const messageService = require('../services/message.service');
const RescueTeam = require('../models/RescueTeam');

const resolveActorTeamId = async (req) => {
  if (req.user.teamId) {
    return req.user.teamId;
  }
  const team = await RescueTeam.findOne({ contact: req.user.email });
  return team ? team._id.toString() : null;
};

const sendMessage = asyncHandler(async (req, res) => {
  const actorTeamId = await resolveActorTeamId(req);

  const message = await messageService.sendMessage(req.params.teamId, {
    role: req.user.role,
    name: req.user.name,
    teamId: actorTeamId,
  }, req.body.text);

  return res.status(201).json(new ApiResponse(201, message, 'Message sent'));
});

const getMessages = asyncHandler(async (req, res) => {
  const actorTeamId = await resolveActorTeamId(req);

  const messages = await messageService.listMessages(req.params.teamId, {
    role: req.user.role,
    name: req.user.name,
    teamId: actorTeamId,
  });

  return res.status(200).json(new ApiResponse(200, messages, 'Team messages fetched'));
});

module.exports = { sendMessage, getMessages };