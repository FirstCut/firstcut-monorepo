"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BlueprintableSchema", {
  enumerable: true,
  get: function get() {
    return _blueprintableSchema.default;
  }
});
exports.PROJECT_BLUEPRINTS = exports.SHOOT_BLUEPRINTS = exports.DELIVERABLE_BLUEPRINTS = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime/core-js/object/freeze"));

var _deliverableBlueprints = require("./deliverable.blueprints.js");

var _projectBlueprints = require("./project.blueprints.js");

var _shootBlueprints = require("./shoot.blueprints.js");

var _blueprintableSchema = _interopRequireDefault(require("./blueprintable.schema.js"));

var DELIVERABLE_BLUEPRINTS = (0, _freeze.default)({
  'FULL_TESTIMONIAL': _deliverableBlueprints.full,
  'TESTIMONIAL_SNIPPET': _deliverableBlueprints.snippet,
  'NOT_A_TEMPLATE': _deliverableBlueprints.not_a_template
});
exports.DELIVERABLE_BLUEPRINTS = DELIVERABLE_BLUEPRINTS;
var SHOOT_BLUEPRINTS = (0, _freeze.default)({
  'CORPORATE_INTERVIEWS': _shootBlueprints.corporate_interviews
});
exports.SHOOT_BLUEPRINTS = SHOOT_BLUEPRINTS;
var PROJECT_BLUEPRINTS = (0, _freeze.default)({
  'CUSTOMER_TESTIMONIAL': _projectBlueprints.customer_testimonial,
  'NOT_A_TEMPLATE': _projectBlueprints.not_a_template
});
exports.PROJECT_BLUEPRINTS = PROJECT_BLUEPRINTS;