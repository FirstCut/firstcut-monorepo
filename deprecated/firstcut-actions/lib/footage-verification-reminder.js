"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var FootageVerificationReminder = new _immutable.Map({
  key: 'footage_verification_reminder',
  action_title: 'Remind to verify footage',
  completed_title: 'Reminder to verify footage sent',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(Models, event_data) {
    var record_id = event_data.record_id;
    var shoot = Models.Shoot.fromId(record_id);

    if (shoot.isDummy || shoot.hasVerifiedFootage) {
      return [];
    }

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(shoot);
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "It has been 24hrs after shoot checkout -- The footage for ".concat(shoot.displayName, " ( ").concat(link, " ) should have been uploaded and verified by now ").concat(shoot.adminOwnerSlackHandle)
      }
    }];
  }
});
var _default = FootageVerificationReminder;
exports.default = _default;