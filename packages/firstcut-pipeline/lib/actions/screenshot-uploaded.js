"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var ScreenshotUploaded = new _immutable.Map({
  key: 'screenshot_uploaded',
  action_title: 'Upload screenshot',
  completed_title: 'Screenshot uploaded',
  schema: _pipelineSchemas.ScreenshotEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id,
        screenshot = event_data.screenshot;

    var shoot = _firstcutModels.Models.getRecordFromId('Shoot', record_id);

    var collaborator = shoot.screenshotCollaborator(screenshot);
    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(shoot);

    var screenshot_url = _firstcutModels.Models.Shoot.screenshotURL(screenshot.filename);

    return [{
      type: _pipelineEnum.ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: "".concat(shoot.displayName, " screenshot uploaded! --- ").concat(link),
        attachments: [{
          fallback: "SCREENSHOT UPLOAD",
          color: "#8ED137",
          author_name: collaborator.displayName,
          author_link: "http://firstcut.meteorapp.com/collaborators/".concat(collaborator._id),
          title: "".concat(collaborator.displayName, " uploaded a screenshot for shoot at ").concat(shoot.locationDisplayName),
          title_link: "http://firstcut.meteorapp.com/shoots/".concat(shoot._id),
          image_url: screenshot_url
        }]
      }
    }];
  }
});
var _default = ScreenshotUploaded;
exports.default = _default;