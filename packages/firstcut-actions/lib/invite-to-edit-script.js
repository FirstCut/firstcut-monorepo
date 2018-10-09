"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _firstcutSchema = require("firstcut-schema");

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _moment = _interopRequireDefault(require("moment"));

var key = 'invite_to_edit_script';
var InviteToEditScript = new _immutable.Map({
  key: key,
  action_title: 'Invite client to edit shoot script',
  completed_title: 'Invited client to edit shoot script',
  customFieldsSchema: function customFieldsSchema(record) {
    return new _firstcutSchema.SimpleSchemaWrapper({
      clientEmailContent: {
        type: String,
        rows: 10,
        customType: 'textarea',
        label: 'Client email custom body content',
        defaultValue: "Hi ".concat(record.clientOwner ? record.clientOwner.firstName : '', ",\nI'm looking forward to working on this script with you. Please follow the link below to view your shoot details and edit the script.")
      }
    });
  },
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;

    if (!record.date || !record.timezone) {
      return true;
    }

    var shootDate = _moment.default.tz(record.date, record.timezone);

    return (0, _moment.default)().isBefore(shootDate) && !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: 'upcoming_shoot_reminder'
    }) && !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: 'shoot_wrap'
    });
  },
  generateActions: function generateActions(Models, eventData) {
    var record_id = eventData.record_id,
        initiator_player_id = eventData.initiator_player_id,
        clientEmailContent = eventData.clientEmailContent;
    var shoot = Models.Shoot.fromId(record_id);
    var initiator = Models.getPlayer(initiator_player_id);
    var lines = clientEmailContent ? clientEmailContent.split(/\n/) : [];
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [shoot.clientOwner],
      cc: [shoot.adminOwner],
      template: 'invite-client-to-edit-script',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shootLink = (0, _firstcutRetrieveUrl.getRecordUrl)(shoot);
        return {
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_link: shootLink,
          lines: lines
        };
      }
    });
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "".concat(shoot.clientOwnerDisplayName, " has been invited to collaborate on the shoot script by ").concat(initiator.displayName, ". ").concat(shoot.adminOwnerSlackHandle)
      }
    }]);
  }
});
var _default = InviteToEditScript;
exports.default = _default;