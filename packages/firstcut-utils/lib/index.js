"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "executeAsyncWithCallback", {
  enumerable: true,
  get: function get() {
    return _utils.executeAsyncWithCallback;
  }
});
Object.defineProperty(exports, "logError", {
  enumerable: true,
  get: function get() {
    return _utils.logError;
  }
});
Object.defineProperty(exports, "isEmpty", {
  enumerable: true,
  get: function get() {
    return _utils.isEmpty;
  }
});
Object.defineProperty(exports, "isURL", {
  enumerable: true,
  get: function get() {
    return _utils.isURL;
  }
});
Object.defineProperty(exports, "asUSDollars", {
  enumerable: true,
  get: function get() {
    return _utils.asUSDollars;
  }
});
Object.defineProperty(exports, "htmlifyString", {
  enumerable: true,
  get: function get() {
    return _utils.htmlifyString;
  }
});
Object.defineProperty(exports, "emitPipelineEvent", {
  enumerable: true,
  get: function get() {
    return _utils.emitPipelineEvent;
  }
});
Object.defineProperty(exports, "removePunctuation", {
  enumerable: true,
  get: function get() {
    return _utils.removePunctuation;
  }
});
Object.defineProperty(exports, "isUTC", {
  enumerable: true,
  get: function get() {
    return _datetime.isUTC;
  }
});
Object.defineProperty(exports, "DATE_FORMATS", {
  enumerable: true,
  get: function get() {
    return _datetime.DATE_FORMATS;
  }
});
Object.defineProperty(exports, "DEFAULT_FORMAT", {
  enumerable: true,
  get: function get() {
    return _datetime.DEFAULT_FORMAT;
  }
});
Object.defineProperty(exports, "humanReadableDate", {
  enumerable: true,
  get: function get() {
    return _datetime.humanReadableDate;
  }
});
Object.defineProperty(exports, "fromNowDate", {
  enumerable: true,
  get: function get() {
    return _datetime.fromNowDate;
  }
});
Object.defineProperty(exports, "userTimezone", {
  enumerable: true,
  get: function get() {
    return _datetime.userTimezone;
  }
});
Object.defineProperty(exports, "ensureLoggedIn", {
  enumerable: true,
  get: function get() {
    return _validate.ensureLoggedIn;
  }
});
Object.defineProperty(exports, "getPlayerFromQuery", {
  enumerable: true,
  get: function get() {
    return _playerUtils.getPlayerFromQuery;
  }
});
Object.defineProperty(exports, "getInviteLink", {
  enumerable: true,
  get: function get() {
    return _playerUtils.getInviteLink;
  }
});
Object.defineProperty(exports, "hasUserProfile", {
  enumerable: true,
  get: function get() {
    return _playerUtils.hasUserProfile;
  }
});
Object.defineProperty(exports, "getUserEmails", {
  enumerable: true,
  get: function get() {
    return _playerUtils.getUserEmails;
  }
});
Object.defineProperty(exports, "getPlayerIdFromUser", {
  enumerable: true,
  get: function get() {
    return _playerUtils.getPlayerIdFromUser;
  }
});
Object.defineProperty(exports, "getPlayer", {
  enumerable: true,
  get: function get() {
    return _playerUtils.getPlayer;
  }
});
Object.defineProperty(exports, "playerIsClient", {
  enumerable: true,
  get: function get() {
    return _playerUtils.playerIsClient;
  }
});
Object.defineProperty(exports, "userPlayer", {
  enumerable: true,
  get: function get() {
    return _playerUtils.userPlayer;
  }
});
Object.defineProperty(exports, "userPlayerId", {
  enumerable: true,
  get: function get() {
    return _playerUtils.userPlayerId;
  }
});
Object.defineProperty(exports, "getPlayerFromEmails", {
  enumerable: true,
  get: function get() {
    return _playerUtils.getPlayerFromEmails;
  }
});
exports.COLLABORATOR_TYPES_TO_LABELS = void 0;

var _utils = require("./utils.js");

var _datetime = require("./datetime.js");

var _validate = require("./validate.js");

var _playerUtils = require("./player.utils.js");

// import { encrypt, decrypt } from './encrypt.js';
var COLLABORATOR_TYPES_TO_LABELS = Object.freeze({
  'interviewer': 'Interviewer',
  'videographer': 'Videographer',
  'adminOwner': 'Admin Owner',
  'postpoOwner': 'PostProduction Owner',
  'clientOwner': 'Client Owner'
});
exports.COLLABORATOR_TYPES_TO_LABELS = COLLABORATOR_TYPES_TO_LABELS;