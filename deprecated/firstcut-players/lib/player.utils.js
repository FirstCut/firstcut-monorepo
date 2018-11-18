"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserEmails = getUserEmails;
exports.getPendingPlayerTasks = getPendingPlayerTasks;
exports.numPendingTasks = numPendingTasks;
exports.userPlayer = userPlayer;
exports.getPlayerFromEmails = getPlayerFromEmails;
exports.getPlayer = getPlayer;
exports.getPlayerFromQuery = getPlayerFromQuery;
exports.playerIsClient = playerIsClient;
exports.initializeCollaboratorFromUser = initializeCollaboratorFromUser;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _firstcutUserSession = require("firstcut-user-session");

function getUserEmails(models, user) {
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

function getPendingPlayerTasks(models, player) {
  if (!player) {
    return [];
  }

  return models.Task.find({
    assignedToPlayerId: player._id,
    completed: {
      $ne: true
    }
  }).toArray();
}

function numPendingTasks(models, player) {
  var tasks = models.getPendingPlayerTasks(player);
  return tasks ? tasks.length : 0;
}

function userPlayer(models) {
  var playerId = (0, _firstcutUserSession.userPlayerId)();

  if (!playerId) {
    return null;
  }

  return getPlayer(models, playerId);
}

function getPlayerFromEmails(models, emails) {
  var query = {
    email: {
      $in: emails
    }
  };
  return getPlayerFromQuery(models, query);
}

function getPlayer(models, id) {
  if (!id) {
    return null;
  }

  var query = {
    _id: id
  };
  return getPlayerFromQuery(models, query);
}

function getPlayerFromQuery(models, query) {
  var player = null;
  var collab = models.Collaborator.findOne(query);

  if (collab) {
    player = collab;
  }

  var client = models.Client.findOne(query);

  if (client) {
    player = client;
  }

  return player;
}

function playerIsClient(models, player) {
  return player && player.modelName === models.Client.modelName;
}

function initializeCollaboratorFromUser(models, user) {
  var lastName = '';
  var firstName = '';
  var thumbnail = '';

  if (user.services && user.services.google) {
    firstName = user.services.google.given_name;
    lastName = user.services.google.family_name;
    thumbnail = user.services.google.picture;
  }

  var emails = models.getUserEmails(user);
  var email = emails.length > 0 ? emails[0] : '';
  return models.Collaborator.createNew({
    firstName: firstName,
    lastName: lastName,
    thumbnail: thumbnail,
    isActive: false,
    skills: [],
    email: email
  });
}