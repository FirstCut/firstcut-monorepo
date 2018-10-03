"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSimulationPlayerId = getSimulationPlayerId;
exports.setSimulationPlayerId = setSimulationPlayerId;
exports.inSimulationMode = inSimulationMode;
exports.getUserEmails = getUserEmails;
exports.getPendingPlayerTasks = getPendingPlayerTasks;
exports.numPendingTasks = numPendingTasks;
exports.getPlayerIdFromUser = getPlayerIdFromUser;
exports.userPlayerId = userPlayerId;
exports.userId = userId;
exports.userPlayer = userPlayer;
exports.getPlayerFromEmails = getPlayerFromEmails;
exports.getPlayer = getPlayer;
exports.getPlayerFromQuery = getPlayerFromQuery;
exports.playerIsClient = playerIsClient;
exports.initializeCollaboratorFromUser = initializeCollaboratorFromUser;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _moment = _interopRequireDefault(require("moment"));

var SIMULATE_PLAYER_ID = 'simulatePlayerId';

function getSimulationPlayerId() {
  if (Meteor.isServer) {
    return '';
  }

  return Session.get(SIMULATE_PLAYER_ID);
}

function setSimulationPlayerId(playerId) {
  if (Meteor.isServer) {
    return null;
  }

  return Session.set(SIMULATE_PLAYER_ID, playerId);
}

function inSimulationMode() {
  if (Meteor.isServer) {
    return false;
  }

  return getSimulationPlayerId() != null;
}

function getUserEmails(user) {
  var emails = [];

  if (user.emails && user.emails[0]) {
    var userEmails = user.emails.map(function (email) {
      return email.address;
    });
    emails = (0, _toConsumableArray2.default)(userEmails).concat((0, _toConsumableArray2.default)(emails));
  }

  if (user.services) {
    var services = Object.values(user.services);
    var serviceEmails = services.map(function (service) {
      return service.email;
    });
    serviceEmails = serviceEmails.filter(function (email) {
      return email != null;
    });
    emails = (0, _toConsumableArray2.default)(emails).concat((0, _toConsumableArray2.default)(serviceEmails));
  }

  return emails;
}

function getPendingPlayerTasks(player) {
  if (!player) {
    return [];
  }

  return _firstcutModels.default.Task.find({
    assignedToPlayerId: player._id,
    completed: {
      $ne: true
    }
  }).toArray();
}

function numPendingTasks(player) {
  var tasks = getPendingPlayerTasks(player);
  return tasks ? tasks.length : 0;
}

function getPlayerIdFromUser(user) {
  if (user && user.profile) {
    return user.profile.playerId;
  }

  return '';
}

function userPlayerId() {
  if (getSimulationPlayerId()) {
    return getSimulationPlayerId();
  }

  if (Meteor.settings.public.playerIdOverride) {
    return Meteor.settings.public.playerIdOverride;
  }

  if (Meteor.user()) {
    return getPlayerIdFromUser(Meteor.user());
  }

  return '';
}

function userId() {
  return Meteor.user() ? Meteor.user()._id : '';
}

function userPlayer() {
  var playerId = userPlayerId();

  if (!playerId) {
    return null;
  }

  return getPlayer(playerId);
}

function getPlayerFromEmails(emails) {
  var query = {
    email: {
      $in: emails
    }
  };
  return getPlayerFromQuery(query);
}

function getPlayer(id) {
  if (!id) {
    return null;
  }

  var query = {
    _id: id
  };
  return getPlayerFromQuery(query);
}

function getPlayerFromQuery(query) {
  var player = null;

  var collab = _firstcutModels.default.Collaborator.findOne(query);

  if (collab) {
    player = collab;
  }

  var client = _firstcutModels.default.Client.findOne(query);

  if (client) {
    player = client;
  }

  return player;
}

function playerIsClient(player) {
  return player && player.modelName === _firstcutModels.default.Client.modelName;
}

function initializeCollaboratorFromUser(user) {
  var lastName = '';
  var firstName = '';
  var thumbnail = '';

  if (user.services && user.services.google) {
    firstName = user.services.google.given_name;
    lastName = user.services.google.family_name;
    thumbnail = user.services.google.picture;
  }

  var emails = getUserEmails(user);
  var email = emails.length > 0 ? emails[0] : '';
  return _firstcutModels.default.Collaborator.createNew({
    firstName: firstName,
    lastName: lastName,
    thumbnail: thumbnail,
    isActive: false,
    skills: [],
    email: email
  });
}