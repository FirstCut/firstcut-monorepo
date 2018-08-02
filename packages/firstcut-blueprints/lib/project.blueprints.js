"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.not_a_template = exports.customer_testimonial = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime/core-js/object/freeze"));

var customer_testimonial = (0, _freeze.default)({
  label: "Customer Testimonial",
  defaults: {},
  default_children: {
    "SHOOT": {
      blueprint: 'CORPORATE_INTERVIEWS'
    }
  }
});
exports.customer_testimonial = customer_testimonial;
var not_a_template = (0, _freeze.default)({
  label: "Not a Template",
  defaults: {},
  default_children: {
    "SHOOT": {
      blueprint: 'CORPORATE_INTERVIEWS'
    }
  }
});
exports.not_a_template = not_a_template;