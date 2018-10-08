"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = enablePlayerUtils;

var _player = require("./player.utils");

function enablePlayerUtils(Models) {
  Models.userId = _player.userId.bind(Models, Models);
  Models.initializeCollaboratorFromUser = _player.initializeCollaboratorFromUser.bind(Models, Models);
  Models.numPendingTasks = _player.numPendingTasks.bind(Models, Models);
  Models.setSimulationPlayerId = _player.setSimulationPlayerId.bind(Models, Models);
  Models.inSimulationMode = _player.inSimulationMode.bind(Models, Models);
  Models.getPendingPlayerTasks = _player.getPendingPlayerTasks.bind(Models, Models);
  Models.getUserEmails = _player.getUserEmails.bind(Models, Models);
  Models.getPlayerFromEmails = _player.getPlayerFromEmails.bind(Models, Models);
  Models.getPlayerFromQuery = _player.getPlayerFromQuery.bind(Models, Models);
  Models.getPlayerIdFromUser = _player.getPlayerIdFromUser.bind(Models, Models);
  Models.getPlayer = _player.getPlayer.bind(Models, Models);
  Models.playerIsClient = _player.playerIsClient.bind(Models, Models);
  Models.userPlayer = _player.userPlayer.bind(Models, Models);
  Models.userPlayerId = _player.userPlayerId.bind(Models, Models);
}