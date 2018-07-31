"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutModels = require("firstcut-models");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var _pipelineUtils = require("../shared/pipeline.utils.js");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
    return _toConsumableArray(email_actions).concat([{
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