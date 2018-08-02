"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserEmails = getUserEmails;
exports.getPlayerIdFromUser = getPlayerIdFromUser;
exports.userPlayerId = userPlayerId;
exports.userPlayer = userPlayer;
exports.getPlayerModel = getPlayerModel;
exports.getPlayerFromEmails = getPlayerFromEmails;
exports.getPlayer = getPlayer;
exports.getPlayerFromQuery = getPlayerFromQuery;
exports.playerIsClient = playerIsClient;

var _values = _interopRequireDefault(require("@babel/runtime/core-js/object/values"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

// export const hasUserProfile = new ValidatedMethod({
//   name: 'has-user-profile',
//   validate: new SimpleSchema({playerEmail: String}).validator(),
//   run({playerEmail}) {
//     if (Meteor.isServer) {
//       const user = Accounts.findUserByEmail(playerEmail) != null;
//       if (user) {
//         return true;
//       } else {
//         //TODO only supports google services
//         return Meteor.users.findOne({"services.google.email": playerEmail}) != null;
//       }
//     }
//   }
// })
//
function getUserEmails(user) {
  var emails = [];

  if (user.emails && user.emails[0]) {
    var user_emails = user.emails.map(function (email) {
      return email.address;
    });
    emails = (0, _toConsumableArray2.default)(user_emails).concat((0, _toConsumableArray2.default)(emails));
  }

  if (user.services) {
    var service_emails = (0, _values.default)(user.services).map(function (service) {
      return service.email;
    }).filter(function (email) {
      return email != null;
    });
    emails = (0, _toConsumableArray2.default)(emails).concat((0, _toConsumableArray2.default)(service_emails));
  }

  return emails;
}

function getPlayerIdFromUser(user) {
  if (user && user.profile) {
    return user.profile.playerId;
  } else {
    return '';
  }
}

function userPlayerId() {
  if (Meteor.user()) {
    return getPlayerIdFromUser(Meteor.user());
  }

  return '';
}

function userPlayer() {
  var playerId = userPlayerId();

  if (!playerId) {
    return null;
  }

  return getPlayer(Models, playerId);
}

function getPlayerModel(Models, player) {
  if (player.model_name == Models.Client.model_name) {
    return Models.Client;
  }

  if (player.model_name == Models.Collaborator.model_name) {
    return Models.Collaborator;
  }

  return null;
}

function getPlayerFromEmails(Models, emails) {
  var query = {
    "email": {
      $in: emails
    }
  };
  return getPlayerFromQuery(Models, query);
}

function getPlayer(Models, id) {
  if (!id) {
    return null;
  }

  var query = {
    "_id": id
  };
  return getPlayerFromQuery(Models, query);
}

function getPlayerFromQuery(Models, query) {
  var player = null;
  var collab = Models.Collaborator.findOne(query);

  if (collab) {
    player = collab;
  }

  var client = Models.Client.findOne(query);

  if (client) {
    player = client;
  }

  return player;
}

function playerIsClient(player) {
  return player && player.model_name == Models.Client.model_name;
}