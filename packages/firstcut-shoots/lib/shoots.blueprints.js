"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime/core-js/object/freeze"));

var corporateInterviews = (0, _freeze.default)({
  label: 'Corporate Interview - 2hr Shoot',
  required_items: ['producer'],
  defaults: {
    duration: 2
  },
  description: 'This is the corporate interviews description'
});
var SHOOT_BLUEPRINTS = (0, _freeze.default)({
  CORPORATE_INTERVIEWS: corporateInterviews
});
var _default = SHOOT_BLUEPRINTS;
exports.default = _default;