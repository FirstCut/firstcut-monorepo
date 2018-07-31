"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var FootageVerificationReminder = new _immutable.Map({
  key: 'footage_verification_reminder',
  action_title: 'Remind to verify footage',
  completed_title: 'Footage verified',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var shoot = _firstcutModels.Models.Shoot.fromId(record_id);

    if (shoot.isDummy) {
      return [];
    }

    return [{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "It has been 24hrs after shoot checkout -- The footage for ".concat(shoot.displayName, " should have been uploaded and verified by now...")
      }
    }];
  }
});
var _default = FootageVerificationReminder;
exports.default = _default;