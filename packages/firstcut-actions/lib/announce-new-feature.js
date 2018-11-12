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

var key = 'announce_new_feature';
var InviteToEditScript = new _immutable.Map({
  key: key,
  action_title: 'Announce new feature',
  completed_title: 'Announced new feature',
  customFieldsSchema: function customFieldsSchema(record) {
    return new _firstcutSchema.SimpleSchemaWrapper({
      cc: Array,
      'cc.$': String
    });
  },
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return true;
  },
  generateActions: function generateActions(Models, eventData) {
    var cc = eventData.cc;
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [{
        email: 'lucy@firstcut.io'
      }],
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