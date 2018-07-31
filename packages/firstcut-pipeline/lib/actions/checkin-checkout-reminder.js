"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var CheckinCheckoutReminder = new _immutable.Map({
  key: 'checkin-checkout-reminder',
  action_title: 'Send checkin-checkout reminder',
  completed_title: 'Reminder to checkin and checkout of shoot sent',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var shoot = _firstcutModels.Models.Shoot.fromId(record_id);

    var collaborator = shoot.videographer;
    var phone = collaborator ? collaborator.phone : _pipelineEnum.FALLBACK_PHONE_NUMBER;
    return [{
      type: _pipelineEnum.ACTIONS.text_message,
      country: collaborator ? collaborator.country : 'United States',
      body: "Your shoot is almost here! This is a reminder to please checkin and checkout of your shoot on the FirstCut Shoot Assistant app. \n \n Do not respond to this text message. If you need to contact us, contact Alex at 4157103903",
      to: phone
    }];
  }
});
var _default = CheckinCheckoutReminder;
exports.default = _default;