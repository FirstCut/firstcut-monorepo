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

var key = 'invoice_paid';
var InvoicePaid = new _immutable.Map({
  key: key,
  action_title: 'Mark invoice as paid',
  completed_title: 'Invoice marked as paid',
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

    var invoice = _firstcutModels.default.Invoice.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(invoice);
    var emailActions = (0, _firstcutActionUtils.getEmailActions)({
      recipients: [invoice.payee],
      template: 'ttp-invoice-paid',
      getSubstitutionData: function getSubstitutionData(recipient) {
        return {
          name: recipient.firstName,
          gig_display_name: invoice.gigDisplayName,
          invoice_link: link
        };
      }
    });
    return (0, _toConsumableArray2.default)(emailActions).concat([{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      content: {
        text: "Invoice for ".concat(invoice.gigDisplayName, " has been marked as paid.")
      }
    }, {
      type: _firstcutPipelineConsts.ACTIONS.custom_function,
      title: 'set invoice to paid',
      execute: function execute() {
        setInvoiceToPaid(invoice);
      }
    }]);
  }
});

function setInvoiceToPaid(i) {
  var invoice = i;
  invoice = invoice.markAsPaid();
  invoice.save();
}

var _default = InvoicePaid;
exports.default = _default;