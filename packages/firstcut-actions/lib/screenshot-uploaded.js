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

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var ScreenshotUploaded = new _immutable.Map({
  key: 'screenshot_uploaded',
  action_title: 'Upload screenshot',
  completed_title: 'Screenshot uploaded',
  schema: _firstcutActionUtils.ScreenshotEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return true;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id,
        screenshot = eventData.screenshot;

    var shoot = _firstcutModels.default.Shoot.fromId(record_id);

    var collaborator = shoot.screenshotCollaborator(screenshot);
    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(shoot);
    var screenshotURL = shoot.screenshotURL(screenshot.filename);
    var collabLink = (0, _firstcutRetrieveUrl.getRecordUrl)(collaborator);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: "".concat(shoot.displayName, " screenshot uploaded! --- ").concat(link, " ").concat(shoot.adminOwnerSlackHandle),
        attachments: [{
          fallback: 'SCREENSHOT UPLOAD',
          color: '#8ED137',
          author_name: collaborator.displayName,
          author_link: collabLink,
          title: "".concat(collaborator.displayName, " uploaded a screenshot for shoot at ").concat(shoot.locationDisplayName, " ").concat(shoot.adminOwnerSlackHandle),
          title_link: link,
          image_url: screenshotURL
        }]
      }
    }];
  }
});
var _default = ScreenshotUploaded;
exports.default = _default;