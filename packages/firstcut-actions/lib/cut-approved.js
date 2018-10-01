"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _immutable = require("immutable");

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var key = 'cut_approved_by_client';
var CutApprovedByClient = new _immutable.Map({
  key: key,
  action_title: 'Mark cut as approved by client',
  completed_title: 'Cut marked as approved by client',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: key
    });
  },
  generateActions: function generateActions(eventData) {
    var record_id = eventData.record_id;

    var cut = _firstcutModels.default.getRecordFromId('Cut', record_id);

    var deliverable = cut.deliverable;
    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(cut);
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
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
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "".concat(cut.displayName, " has been approved by the client! ").concat(link, " ").concat(cut.adminOwnerSlackHandle, " ").concat(cut.postpoOwnerSlackHandle)
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'set this cut as the approved cut for the deliverable',
      execute: function execute() {
        deliverable = deliverable.set('approvedCutId', record_id);
        deliverable.save();
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: "set the deliverable's invoices to due",
      execute: function execute() {
        (0, _firstcutActionUtils.setAllRecordInvoicesToDue)(deliverable);
      }
    }]);
  }
});
var _default = CutApprovedByClient;
exports.default = _default;