"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var key = 'invoice_set_to_due';
var InvoiceSetToDue = new _immutable.Map({
  key: key,
  action_title: 'Invoice set to due',
  completed_title: 'Invoice set to due',
  schema: _firstcutActionUtils.RecordEvents,
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
    return !(0, _firstcutActionUtils.recordHistoryIncludesEvent)({
      record: record,
      event: key
    });
  },
  generateActions: function generateActions(Models, eventData) {
    var record_id = eventData.record_id;
    var invoice = Models.Invoice.fromId(record_id);
    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(invoice);
    var nicole = Models.Collaborator.getNicoleProfile();
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Invoice for ".concat(invoice.gigDisplayName, " ").concat(link, " has been set to due ").concat(nicole.slackHandle, ".")
      }
    }];
  }
});
var _default = InvoiceSetToDue;
exports.default = _default;