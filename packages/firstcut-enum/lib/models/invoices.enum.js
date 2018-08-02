"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INVOICE_STATUS = exports.INVOICE_TYPES = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime/core-js/object/freeze"));

var INVOICE_TYPES = (0, _freeze.default)({
  'DELIVERABLE': 'Deliverable',
  'PROJECT': 'Project',
  'SHOOT': 'Shoot'
});
exports.INVOICE_TYPES = INVOICE_TYPES;
var INVOICE_STATUS = (0, _freeze.default)({
  'NOT_DUE': 'Not Due Yet',
  'DUE': 'Due',
  'PAID': 'Paid'
});
exports.INVOICE_STATUS = INVOICE_STATUS;