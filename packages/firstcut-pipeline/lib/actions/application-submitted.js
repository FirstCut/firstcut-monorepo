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

var ApplicationSubmitted = new _immutable.Map({
  key: 'application_submitted',
  action_title: 'Submit Application',
  completed_title: 'Application Submitted',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var collaborator = _firstcutModels.Models.Collaborator.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(collaborator);
    return [{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "An application to be a collaborator was submitted -- ".concat(link)
      }
    }];
  }
});
var _default = ApplicationSubmitted;
exports.default = _default;