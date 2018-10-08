"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var ReminderToGetClientFeedback = new _immutable.Map({
  key: 'reminder_to_get_client_feedback',
  action_title: 'Remind to get client feedback',
  completed_title: 'Reminder to get client feedback sent',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, eventData) {
    var record_id = eventData.record_id;
    var cut = Models.Cut.fromId(record_id);

    if (cut.clientHasSubmittedFeedback) {
      return [];
    }

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "You sent ".concat(cut.displayName, " (").concat(link, ") to the client for review 72hrs ago and they have not yet provided feedback. Is it time to remind them? ").concat(cut.adminOwnerSlackHandle)
      }
    }];
  }
});
var _default = ReminderToGetClientFeedback;
exports.default = _default;