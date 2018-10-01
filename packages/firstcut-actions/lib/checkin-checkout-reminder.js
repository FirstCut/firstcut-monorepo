"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var CheckinCheckoutReminder = new _immutable.Map({
  key: 'checkin-checkout-reminder',
  action_title: 'Send checkin-checkout reminder',
  completed_title: 'Reminder to checkin and checkout of shoot sent',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id;

    var shoot = _firstcutModels.default.Shoot.fromId(record_id);

    var collaborator = shoot.videographer;
    var phone = collaborator ? collaborator.phone : _firstcutPipelineConsts.FALLBACK_PHONE_NUMBER;
    return [{
      type: _firstcutPipelineConsts.ACTIONS.text_message,
      country: collaborator ? collaborator.country : 'United States',
      body: 'Your shoot is almost here! This is a reminder to please checkin and checkout of your shoot on the FirstCut Shoot Assistant app. \n \n Do not respond to this text message. If you need to contact us, contact Alex at 4157103903',
      to: phone
    }];
  }
});
var _default = CheckinCheckoutReminder;
exports.default = _default;