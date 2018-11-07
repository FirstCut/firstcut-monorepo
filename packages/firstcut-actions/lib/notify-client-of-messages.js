"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _moment = _interopRequireDefault(require("moment"));

var key = 'notify_client_of_messages';
var NotifyClientOfNewMessages = new _immutable.Map({
  key: key,
  action_title: 'Notify Client Of Messages',
  completed_title: 'Client notified that they have messages',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return true;
  },
  generateActions: function generateActions(Models, eventData) {
    var record_id = eventData.record_id,
        initiator_player_id = eventData.initiator_player_id,
        clientEmailContent = eventData.clientEmailContent;
    var project = Models.Project.fromId(record_id);
    var initiator = Models.getPlayer(initiator_player_id);
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [project.clientOwner],
      cc: [project.adminOwner],
      template: 'notify-client-of-messages',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var projectLink = (0, _firstcutRetrieveUrl.getRecordUrl)(project);
        return {
          name: recipient.firstName,
          project_name: project.displayName,
          admin_owner_name: project.adminOwnerDisplayName,
          reply_to: project.adminOwnerEmail,
          project_link: projectLink
        };
      }
    });
    return (0, _toConsumableArray2.default)(emailActions);
  }
});
var _default = NotifyClientOfNewMessages;
exports.default = _default;