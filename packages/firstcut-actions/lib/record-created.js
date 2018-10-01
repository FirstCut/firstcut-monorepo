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

var RecordCreated = new _immutable.Map({
  key: 'record_created',
  action_title: 'Create record',
  completed_title: 'Record created',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id,
        record_type = event_data.record_type,
        initiator_player_id = event_data.initiator_player_id;

    var record = _firstcutModels.default[record_type].fromId(record_id);

    if (record.isDummy) {
      return [];
    }

    var initiator = _firstcutModels.default.Collaborator.fromId(initiator_player_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(record);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "New ".concat(record.modelName, ": ").concat(record.displayName, " created by ").concat(initiator ? initiator.displayName : 'AUTOMATED', ". ").concat(link)
      }
    }];
  }
});
var _default = RecordCreated;
exports.default = _default;