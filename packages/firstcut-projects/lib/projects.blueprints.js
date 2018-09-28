"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime/core-js/object/freeze"));

var customerTestimonial = (0, _freeze.default)({
  label: 'Customer Testimonial',
  defaults: {},
  default_children: {
    SHOOT: {
      blueprint: 'CORPORATE_INTERVIEWS'
    }
  }
});
var notATemplate = (0, _freeze.default)({
  label: 'Not a Template',
  defaults: {},
  default_children: {
    SHOOT: {
      blueprint: 'CORPORATE_INTERVIEWS'
    }
  }
});
var PROJECT_BLUEPRINTS = (0, _freeze.default)({
  CUSTOMER_TESTIMONIAL: customerTestimonial,
  NOT_A_TEMPLATE: notATemplate
});
var _default = PROJECT_BLUEPRINTS;
exports.default = _default;