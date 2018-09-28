"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _action = require("./shared/action.schemas");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _action2 = require("./shared/action.utils");

var _firstcutUtils = require("firstcut-utils");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var UpcomingShootReminder = new _immutable.Map({
  key: 'upcoming_shoot_reminder',
  action_title: 'Send Upcoming Shoot Reminder',
  completed_title: 'Upcoming Shoot Reminder Sent',
  schema: _action.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id;

    var shoot = _firstcutModels.default.Shoot.fromId(record_id);

    var scheduledDate = (0, _firstcutUtils.humanReadableDate)({
      date: shoot.date,
      timezone: shoot.timezone,
      format: 'clean'
    });
    var footageFolder = shoot.footageFolder || shoot.generateFootageFolderName();
    var internalEmails = (0, _action2.getEmailActions)({
      recipients: [shoot.adminOwner, shoot.interviewer, shoot.videographer],
      template: 'upcoming-shoot-reminder',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          project_manager_name: shoot.adminOwnerDisplayName,
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          scheduled_date: scheduledDate,
          footage_folder: footageFolder
        };
      }
    });
    var videographerEmails = (0, _action2.getEmailActions)({
      recipients: [shoot.videographer],
      template: 'videographer-upcoming-shoot-reminder',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shootLink = (0, _firstcutRetrieveUrl.getInviteLink)(shoot.videographer, (0, _firstcutRetrieveUrl.getRecordUrl)(shoot));
        return {
          project_manager_name: shoot.adminOwnerDisplayName,
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          scheduled_date: scheduledDate,
          reply_to: shoot.adminOwnerEmail,
          footage_folder: footageFolder,
          shoot_link: shootLink
        };
      }
    });
    var clientEmails = (0, _action2.getEmailActions)({
      recipients: [shoot.clientOwner],
      cc: [shoot.adminOwner],
      template: 'ttc-shoot-reminder',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shootLink = (0, _firstcutRetrieveUrl.getInviteLink)(shoot.clientOwner, (0, _firstcutRetrieveUrl.getRecordUrl)(shoot));
        var shootDate = (0, _firstcutUtils.humanReadableDate)({
          date: shoot.date,
          format: 'formal_day'
        });
        return {
          name: recipient.firstName,
          project_name: shoot.projectDisplayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_date: shootDate,
          shoot_link: shootLink
        };
      }
    });
    var emailActions = (0, _toConsumableArray2.default)(internalEmails).concat((0, _toConsumableArray2.default)(clientEmails), (0, _toConsumableArray2.default)(videographerEmails));
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Reminder about an upcoming shoot: ".concat(shoot.displayName, " is scheduled for ").concat(scheduledDate, " ").concat(shoot.adminOwnerSlackHandle)
      }
    }]);
  }
});
var _default = UpcomingShootReminder;
exports.default = _default;