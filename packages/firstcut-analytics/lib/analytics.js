"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _firstcutPlayers = require("firstcut-players");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

// import { getQualifiedSkills } from '/imports/ui/config';
if (Meteor.settings.public.environment === 'development') {
  analytics = {
    load: function load() {
      console.log('Analytics load');
    },
    page: function page() {
      console.log('Analytics page');
    },
    track: function track() {
      console.log('Analytics track');
    },
    identify: function identify() {
      console.log('Analytics identify');
    },
    group: function group() {
      console.log('Analytics group');
    }
  };
}

var Analytics = {
  init: function init() {
    analytics.load('q7fljn00pJH2VTzpOAv08t2AH5d2tfFy');

    if ((0, _firstcutPlayers.userId)()) {
      this.identifyCurrentUser();
    }
  },
  trackError: function trackError(data) {
    this.track('Error', data);
  },
  trackAction: function trackAction(data) {
    var event = data.event,
        record = data.record,
        rest = (0, _objectWithoutProperties2.default)(data, ["event", "record"]);
    var eventName = "Action ".concat(_firstcutPipelineConsts.EVENT_LABELS[event]);
    this.track(eventName, (0, _objectSpread2.default)({
      event: eventName,
      _id: record._id,
      modelName: record.modelName
    }, rest));
  },
  trackEditRecordEvent: function trackEditRecordEvent(data) {
    var eventName = 'Editing record';
    this.track(eventName, data);
  },
  trackUploadEvent: function trackUploadEvent(data) {
    var eventName = 'Uploaded file';
    this.track(eventName, data);
  },
  trackClickEvent: function trackClickEvent(data) {
    var name = data.name,
        rest = (0, _objectWithoutProperties2.default)(data, ["name"]);
    var eventName = "Clicked ".concat(name);
    this.track(eventName, rest);
  },
  trackNavigationEvent: function trackNavigationEvent(data) {
    var name = data.name,
        modelName = data.modelName;
    var pageName = name;

    if (modelName) {
      pageName = "".concat(modelName, " ").concat(name);
    }

    analytics.page(pageName, data);
  },
  track: function track(name, d) {
    var data = (0, _objectSpread2.default)({}, d, {
      userId: (0, _firstcutPlayers.userId)()
    });
    analytics.track(name, data);
  },
  identifyCurrentUser: function identifyCurrentUser() {
    if ((0, _firstcutPlayers.inSimulationMode)()) {
      analytics.identify('Simulation', {
        _id: (0, _firstcutPlayers.userId)(),
        playerId: (0, _firstcutPlayers.getPlayerIdFromUser)(Meteor.user()),
        simulationPlayerId: (0, _firstcutPlayers.userPlayerId)()
      });
      analytics.group('Simulation');
      return;
    }

    var player = (0, _firstcutPlayers.userPlayer)();

    if (!player) {
      analytics.identify('Anonymous', {});
      analytics.group('Anonymous');
      return;
    }

    var traits = {
      _id: (0, _firstcutPlayers.userId)(),
      email: player.email,
      playerId: player._id,
      name: player.displayName
    };

    if (player.modelName === 'Client') {
      var company = player.company,
          companyId = player.companyId;
      analytics.identify(player.displayName, (0, _objectSpread2.default)({}, traits, {
        companyName: company.displayName,
        companyId: companyId
      }));
      analytics.group(company.displayName, {
        _id: company._id,
        website: company.website
      });
      analytics.group('Client');
    } else {
      analytics.identify(player.displayName, (0, _objectSpread2.default)({}, traits, {
        skills: player.skills
      }));
      analytics.group('Collaborator');
    }
  }
};
var _default = Analytics;
exports.default = _default;