"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var CutDueReminder = new _immutable.Map({
  key: 'cut_due_reminder',
  action_title: 'Send Cut Due Reminder',
  completed_title: 'Cut due reminder sent',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, event_data) {
    var record_id = event_data.record_id,
        cut_type_due = event_data.cut_type_due;
    var deliverable = Models.Deliverable.fromId(record_id);

    if (deliverable.hasCutOfType(cut_type_due)) {
      return [];
    }

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(deliverable);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "The next cut for ".concat(deliverable.displayName, " (").concat(link, ") is due in 24hrs ").concat(deliverable.postpoOwnerSlackHandle, " ").concat(deliverable.adminOwnerSlackHandle, ".")
      }
    }];
  }
});
var _default = CutDueReminder;
exports.default = _default;