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

var key = 'cut_approved_by_client';
var CutApprovedByClient = new _immutable.Map({
  key: key,
  action_title: 'Mark cut as approved by client',
  completed_title: 'Cut marked as approved by client',
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

    var cut = _firstcutModels.Models.getRecordFromId('Cut', record_id);

    var deliverable = cut.deliverable;
    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var email_actions = (0, _pipelineUtils.getEmailActions)({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 'cut-approved-by-client',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          deliverable_name: cut.deliverableDisplayName,
          link: link
        };
      }
    });
    return (0, _toConsumableArray2.default)(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "".concat(cut.displayName, " has been approved by the client! ").concat(link)
      }
    }, {
      type: _pipelineEnum.ACTIONS.custom_function,
      title: 'set this cut as the approved cut for the deliverable',
      execute: function execute() {
        deliverable = deliverable.set('approvedCutId', record_id);
        deliverable.save();
      }
    }, {
      type: _pipelineEnum.ACTIONS.custom_function,
      title: "set the deliverable's invoices to due",
      execute: function execute() {
        (0, _pipelineUtils.setInvoicesToDue)(deliverable);
      }
    }]);
  }
});
var _default = CutApprovedByClient;
exports.default = _default;