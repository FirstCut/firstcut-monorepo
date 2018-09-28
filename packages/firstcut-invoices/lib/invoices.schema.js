"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _schema = require("/imports/api/schema");

var _invoices = require("./invoices.enum");

var _base = _interopRequireDefault(require("/imports/api/schema/base.schema"));

var InvoiceSchema = new _schema.SimpleSchemaWrapper({
  type: {
    type: String,
    required: true,
    label: 'Gig Type',
    enumOptions: _invoices.INVOICE_TYPES
  },
  status: {
    type: String,
    enumOptions: _invoices.INVOICE_STATUS,
    sortBy: 'off',
    defaultValue: 'NOT_DUE',
    required: true
  },
  gigId: {
    type: String,
    label: 'Gig',
    required: true
  },
  payerId: {
    type: String,
    label: 'Client',
    serviceDependency: 'Client'
  },
  payeeId: {
    type: String,
    label: 'Payee',
    serviceDependency: 'COLLABORATOR'
  },
  transactionId: {
    type: String
  },
  date_due: {
    type: Date,
    autoValue: function autoValue() {
      var status = this.siblingField('status');
      var due = status.isSet && status.value == 'DUE';

      if (!this.isSet && due) {
        return new Date();
      }
    }
  },
  date_paid: {
    type: Date,
    autoValue: function autoValue() {
      var status = this.siblingField('status');
      var paid = status.isSet && status.value == 'PAID';

      if (!this.isSet && paid) {
        return new Date();
      }
    }
  },
  amount: {
    type: Number,
    // TODO: check that this allows for floats or maybe even use SimpleSchema.
    defaultValue: 0,
    required: true
  },
  note: {
    type: String,
    label: 'Note'
  }
});
InvoiceSchema.extend(_base.default);
var _default = InvoiceSchema;
exports.default = _default;