"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var customerTestimonial = Object.freeze({
  label: 'Customer Testimonial',
  defaults: {},
  default_children: {
    SHOOT: {
      blueprint: 'CORPORATE_INTERVIEWS'
    }
  }
});
var notATemplate = Object.freeze({
  label: 'Not a Template',
  defaults: {},
  default_children: {
    SHOOT: {
      blueprint: 'CORPORATE_INTERVIEWS'
    }
  }
});
var PROJECT_BLUEPRINTS = Object.freeze({
  CUSTOMER_TESTIMONIAL: customerTestimonial,
  NOT_A_TEMPLATE: notATemplate
});
var _default = PROJECT_BLUEPRINTS;
exports.default = _default;