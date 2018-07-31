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

var RecordCreated = new _immutable.Map({
  key: 'record_created',
  action_title: 'Create record',
  completed_title: 'Record created',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id,
        record_type = event_data.record_type,
        initiator_player_id = event_data.initiator_player_id;

    var record = _firstcutModels.Models[record_type].fromId(record_id);

    if (record.isDummy) {
      return [];
    }

    var initiator = _firstcutModels.Models.Collaborator.fromId(initiator_player_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(record);
    return [{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "New ".concat(record.model_name, ": ").concat(record.displayName, " created by ").concat(initiator ? initiator.displayName : 'AUTOMATED', ". ").concat(link)
      }
    }];
  }
});
var _default = RecordCreated;
exports.default = _default;