"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _pipelineUtils = require("../shared/pipeline.utils.js");

var _firstcutUtils = require("firstcut-utils");

var _firstcutModels = require("firstcut-models");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var UpcomingShootReminder = new _immutable.Map({
  key: 'upcoming_shoot_reminder',
  action_title: "Send Upcoming Shoot Reminder",
  completed_title: "Upcoming Shoot Reminder Sent",
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var shoot = _firstcutModels.Models.Shoot.fromId(record_id);

    var scheduled_date = (0, _firstcutUtils.humanReadableDate)({
      date: shoot.date,
      timezone: shoot.timezone,
      format: 'clean'
    });
    var footage_folder = shoot.footageFolder || shoot.generateFootageFolderName();
    var internal_emails = (0, _pipelineUtils.getEmailActions)({
      recipients: [shoot.adminOwner, shoot.interviewer, shoot.videographer],
      template: 'upcoming-shoot-reminder',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          project_manager_name: shoot.adminOwnerDisplayName,
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          scheduled_date: scheduled_date,
          footage_folder: footage_folder
        };
      }
    });
    var videographer_emails = (0, _pipelineUtils.getEmailActions)({
      recipients: [shoot.videographer],
      template: 'videographer-upcoming-shoot-reminder',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shoot_link = (0, _firstcutRetrieveUrl.getInviteLink)(shoot.videographer, (0, _firstcutRetrieveUrl.getRecordUrl)(shoot));
        return {
          project_manager_name: shoot.adminOwnerDisplayName,
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          scheduled_date: scheduled_date,
          reply_to: shoot.adminOwnerEmail,
          footage_folder: footage_folder,
          shoot_link: shoot_link
        };
      }
    });
    var client_emails = (0, _pipelineUtils.getEmailActions)({
      recipients: [shoot.adminOwner],
      template: 'ttc-shoot-reminder',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shoot_link = (0, _firstcutRetrieveUrl.getInviteLink)(shoot.clientOwner, (0, _firstcutRetrieveUrl.getRecordUrl)(shoot));
        var shoot_date = (0, _firstcutUtils.humanReadableDate)({
          date: shoot.date,
          format: 'formal_day'
        });
        return {
          name: shoot.clientOwner.firstName,
          project_name: shoot.projectDisplayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_date: shoot_date,
          shoot_link: shoot_link
        };
      }
    });
    var email_actions = (0, _toConsumableArray2.default)(internal_emails).concat((0, _toConsumableArray2.default)(client_emails), (0, _toConsumableArray2.default)(videographer_emails));
    return (0, _toConsumableArray2.default)(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "Reminder about an upcoming shoot: ".concat(shoot.displayName, " is scheduled for ").concat(scheduled_date)
      }
    }]);
  }
});
var _default = UpcomingShootReminder;
exports.default = _default;