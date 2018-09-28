"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _action = require("./shared/action.schemas");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var ScreenshotRejected = new _immutable.Map({
  key: 'screenshot_rejected',
  action_title: 'Reject screenshot',
  completed_title: 'Screenshot rejected',
  schema: _action.ScreenshotEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        screenshot = eventData.screenshot;

    var shoot = _firstcutModels.default.Shoot.fromId(record_id);

    var collaborator = shoot.screenshotCollaborator(screenshot);
    var slackText = "A screenshot was rejected for ".concat(shoot.displayName, ". Reasons: ").concat(screenshot.notes);
    var phone = collaborator ? collaborator.phone : _firstcutPipelineConsts.FALLBACK_PHONE_NUMBER;

    if (!collaborator || !phone) {
      slackText = "WARNING: attempted to send text to collaborator for screenshot approval, but could not find collaborator. \n please contact them manually for shoot ".concat(shoot.displayName);
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
      body: "Your screenshot ".concat(screenshotDisplayString, " was rejected. Reason: ").concat(screenshot.notes, ". Do not respond to this text message. If you need to contact us, contact Alex at 4157103903"),
      to: phone
    }];
  }
});
var _default = ScreenshotRejected;
exports.default = _default;