"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _action = require("./shared/action.schemas");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var ReminderToSetCutDue = new _immutable.Map({
  key: 'reminder_to_set_cut_due',
  action_title: 'Remind To Set Cut Due',
  completed_title: 'Reminder to set cut due sent',
  schema: _action.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var deliverable = _firstcutModels.default.Deliverable.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(deliverable);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "REMINDER: ".concat(deliverable.adminOwnerSlackHandle, " Set the cut due date for ").concat(deliverable.displayName, " (").concat(link, ") if it should not be the default 72hrs from feedback sent!")
      }
    }];
  }
});
var _default = ReminderToSetCutDue;
exports.default = _default;