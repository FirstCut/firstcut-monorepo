"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INVOICE_STATUS = exports.INVOICE_TYPES = void 0;
var INVOICE_TYPES = Object.freeze({
  'DELIVERABLE': 'Deliverable',
  'PROJECT': 'Project',
  'SHOOT': 'Shoot'
});
exports.INVOICE_TYPES = INVOICE_TYPES;
var INVOICE_STATUS = Object.freeze({
  'NOT_DUE': 'Not Due Yet',
  'DUE': 'Due',
  'PAID': 'Paid'
});
exports.INVOICE_STATUS = INVOICE_STATUS;