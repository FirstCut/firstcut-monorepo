"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

var _firstcutEnum = require("firstcut-enum");

var _baseSchema = _interopRequireDefault(require("./shared/base.schema.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InvoiceSchema = new _firstcutSchemaBuilder.FCSchema({
  type: {
    type: String,
    required: true,
    label: 'Gig Type',
    enumOptions: _firstcutEnum.INVOICE_TYPES
  },
  status: {
    type: String,
    enumOptions: _firstcutEnum.INVOICE_STATUS,
    sortBy: 'off',
    defaultValue: "NOT_DUE",
    required: true
  },
  gigId: {
    type: String,
    label: 'Gig',
    required: true
  },
  payeeId: {
    type: String,
    label: 'Payee',
    serviceDependency: 'COLLABORATOR',
    required: true
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
    //TODO: check that this allows for floats or maybe even use SimpleSchema.
    defaultValue: 0,
    required: true
  },
  note: {
    type: String,
    label: 'Note'
  }
});
InvoiceSchema.extend(_baseSchema.default);
var _default = InvoiceSchema;
exports.default = _default;