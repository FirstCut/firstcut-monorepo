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

var key = 'invoice_paid';
var InvoicePaid = new _immutable.Map({
  key: key,
  action_title: 'Mark invoice as paid',
  completed_title: 'Invoice marked as paid',
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

    var invoice = _firstcutModels.Models.Invoice.fromId(record_id);

    var link = (0, _firstcutRetrieveUrl.getRecordUrl)(invoice);
    var email_actions = (0, _pipelineUtils.getEmailActions)({
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
    return (0, _toConsumableArray2.default)(email_actions).concat([{
      type: _pipelineEnum.ACTIONS.slack_notify,
      content: {
        text: "Invoice for ".concat(invoice.gigDisplayName, " has been marked as paid.")
      }
    }, {
      type: _pipelineEnum.ACTIONS.custom_function,
      title: 'set invoice to paid',
      execute: function execute() {
        setInvoiceToPaid(invoice);
      }
    }]);
  }
});

function setInvoiceToPaid(invoice) {
  invoice = invoice.markAsPaid();
  invoice.save();
}

var _default = InvoicePaid;
exports.default = _default;