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

var key = 'send_cut_to_client';
var SendCutToClient = new _immutable.Map({
  key: 'send_cut_to_client',
  action_title: 'Send cut to client',
  completed_title: 'Cut sent to client',
  schema: _pipelineSchemas.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return !(0, _pipelineUtils.historyIncludesEvent)({
      record: record,
      event: key
    });
  },
  generateActions: function generateActions(event_data) {
    var record_id = event_data.record_id;

    var cut = _firstcutModels.Models.Cut.fromId(record_id);

    var cut_link = (0, _firstcutRetrieveUrl.getInviteLink)(cut.clientOwner, (0, _firstcutRetrieveUrl.getRecordUrl)(cut));
    var client_emails = (0, _pipelineUtils.getEmailActions)({
      recipients: [cut.adminOwner],
      template: 't-send-cut-to-client',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: cut.clientOwner.firstName,
          cut_type: cut.typeLabel,
          project_manager_name: cut.adminOwnerDisplayName,
          deliverable_name: cut.deliverableDisplayName,
          reply_to: cut.adminOwnerEmail,
          cut_link: cut_link
        };
      }
    });
    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var internal_emails = (0, _pipelineUtils.getEmailActions)({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 'cut-has-been-sent-to-client',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          deliverable_name: cut.deliverableDisplayName,
          reply_to: cut.adminOwnerEmail,
          link: link
        };
      }
    });
    var email_actions = (0, _toConsumableArray2.default)(internal_emails).concat((0, _toConsumableArray2.default)(client_emails));
    return (0, _toConsumableArray2.default)(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "".concat(cut.displayName, " has been sent to the client automatically using dashboard actions! ").concat(link)
      }
    }]);
  }
});
var _default = SendCutToClient;
exports.default = _default;