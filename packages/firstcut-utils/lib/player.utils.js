"use strict";

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

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
    emails = _toConsumableArray(user_emails).concat(_toConsumableArray(emails));
  }

  if (user.services) {
    var service_emails = Object.values(user.services).map(function (service) {
      return service.email;
    }).filter(function (email) {
      return email != null;
    });
    emails = _toConsumableArray(emails).concat(_toConsumableArray(service_emails));
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