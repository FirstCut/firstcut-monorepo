"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var ScreenshotRejected = new _immutable.Map({
  key: 'screenshot_rejected',
  action_title: 'Reject screenshot',
  completed_title: 'Screenshot rejected',
  schema: _pipelineSchemas.ScreenshotEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id,
        screenshot = event_data.screenshot;

    var shoot = _firstcutModels.Models.Shoot.fromId(record_id);

    var collaborator = shoot.screenshotCollaborator(screenshot);
    var slack_text = "A screenshot was rejected for ".concat(shoot.displayName, ". Reasons: ").concat(screenshot.notes);
    var phone = collaborator ? collaborator.phone : _pipelineEnum.FALLBACK_PHONE_NUMBER;

    if (!collaborator || !phone) {
      slack_text = "WARNING: attempted to send text to collaborator for screenshot approval, but could not find collaborator. \n please contact them manually for shoot ".concat(shoot.displayName);
      phone = _pipelineEnum.FALLBACK_PHONE_NUMBER;
    }

    return [{
      type: _pipelineEnum.ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: slack_text
      }
    }, {
      type: _pipelineEnum.ACTIONS.text_message,
      country: collaborator ? collaborator.country : 'United States',
      body: "Your screenshot ".concat(shoot.getScreenshotDisplayString(screenshot), " was rejected. Reason: ").concat(screenshot.notes, ". Do not respond to this text message. If you need to contact us, contact Alex at 4157103903"),
      to: phone
    }];
  }
});
var _default = ScreenshotRejected;
exports.default = _default;