"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = enablePlayerUtils;

var _player = require("./player.utils");

function enablePlayerUtils(Models) {
  Models.initializeCollaboratorFromUser = _player.initializeCollaboratorFromUser.bind(Models, Models);
  Models.numPendingTasks = _player.numPendingTasks.bind(Models, Models);
  Models.getPendingPlayerTasks = _player.getPendingPlayerTasks.bind(Models, Models);
  Models.getUserEmails = _player.getUserEmails.bind(Models, Models);
  Models.getPlayerFromEmails = _player.getPlayerFromEmails.bind(Models, Models);
  Models.getPlayerFromQuery = _player.getPlayerFromQuery.bind(Models, Models);
  Models.getPlayer = _player.getPlayer.bind(Models, Models);
  Models.playerIsClient = _player.playerIsClient.bind(Models, Models);
  Models.userPlayer = _player.userPlayer.bind(Models, Models);
}