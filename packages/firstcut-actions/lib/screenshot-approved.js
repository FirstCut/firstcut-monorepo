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

var ScreenshotApproved = new _immutable.Map({
  key: 'screenshot_approved',
  action_title: 'Approve screenshot',
  completed_title: 'Screenshot approved',
  schema: _firstcutActionUtils.ScreenshotEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        screenshot = eventData.screenshot;

    var shoot = _firstcutModels.default.Shoot.fromId(record_id);

    var collaborator = shoot.screenshotCollaborator(screenshot);
    var slackText = "A screenshot was approved for ".concat(shoot.displayName);
    var phone = collaborator ? collaborator.phone : _firstcutPipelineConsts.FALLBACK_PHONE_NUMBER;

    if (!collaborator || !phone) {
      slackText = "WARNING: attempted to send text to collaborator for screenshot approval, but could not find collaborator. please contact them manually for shoot ".concat(shoot.displayName);
      phone = _firstcutPipelineConsts.FALLBACK_PHONE_NUMBER;
    }

    var screenshotDisplayString = _firstcutModels.default.Shoot.getScreenshotDisplayString(screenshot);

    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: slackText
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.text_message,
      country: collaborator ? collaborator.country : 'United States',
      body: "Your screenshot ".concat(screenshotDisplayString, " has been approved. \n Do not respond to this text message. If you need to contact us, contact Alex at 4157103903"),
      to: phone
    }];
  }
});
var _default = ScreenshotApproved;
exports.default = _default;