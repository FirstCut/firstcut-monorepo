"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _pipelineUtils = require("../shared/pipeline.utils.js");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _firstcutUtils = require("firstcut-utils");

var key = 'confirm_footage_uploaded';
var ConfirmFootageUpload = new _immutable.Map({
  key: key,
  action_title: 'Confirm footage uploaded',
  completed_title: 'Footage confirmed uploaded',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    // TODO: include this when confirmed historyIncludesEvent({record, event: 'shoot_wrap'});
    return !(0, _pipelineUtils.historyIncludesEvent)({
      record: record,
      event: key
    }) && !(0, _pipelineUtils.historyIncludesEvent)({
      record: record,
      event: 'footage_verified'
    });
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id,
        initiator_player_id = event_data.initiator_player_id;

    var shoot = _firstcutModels.Models.Shoot.fromId(record_id);

    var collaborator = (0, _firstcutUtils.getPlayer)(_firstcutModels.Models, initiator_player_id);
    var internal_emails = (0, _pipelineUtils.getEmailActions)({
      recipients: [shoot.adminOwner],
      template: 'footage-confirmed-uploaded',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shoot_link = (0, _firstcutRetrieveUrl.getInviteLink)(recipient, (0, _firstcutRetrieveUrl.getRecordUrl)(shoot));
        return {
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          initiator_name: collaborator.displayName,
          shoot_link: shoot_link
        };
      }
    });
    var confirmation_emails = (0, _pipelineUtils.getEmailActions)({
      recipients: [collaborator],
      template: 'thank-you-for-uploading-footage',
      getSubstitutionData: function getSubstitutionData(recipient) {
        var shoot_link = (0, _firstcutRetrieveUrl.getInviteLink)(recipient, (0, _firstcutRetrieveUrl.getRecordUrl)(shoot));
        return {
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail
        };
      }
    });
    var email_actions = (0, _toConsumableArray2.default)(confirmation_emails).concat((0, _toConsumableArray2.default)(internal_emails));
    return [{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "Footage for ".concat(shoot.displayName, " has been confirmed as uploaded by ").concat(collaborator.displayName, ".")
      }
    }].concat((0, _toConsumableArray2.default)(email_actions));
  }
});
var _default = ConfirmFootageUpload;
exports.default = _default;