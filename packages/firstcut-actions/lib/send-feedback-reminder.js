"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var SendFeedbackReminder = new _immutable.Map({
  key: 'send_feedback_reminder',
  action_title: 'Remind to send feedback',
  completed_title: 'Reminder to send feedback sent',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var cut = _firstcutModels.default.Cut.fromId(record_id);

    if (cut.hasVerifiedRevisions) {
      return [];
    }

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Feedback for ".concat(cut.displayName, " (").concat(link, ") was submitted 12hrs ago. This is a reminder to verify it and send it to the editor! ").concat(cut.adminOwnerSlackHandle)
      }
    }];
  }
});
var _default = SendFeedbackReminder;
exports.default = _default;