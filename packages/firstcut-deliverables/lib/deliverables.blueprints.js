"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.notATemplate = exports.snippet = exports.full = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime/core-js/object/freeze"));

var full = {
  label: 'Full Testimonial Video',
  required_items: ['logo', 'cta', 'song'],
  defaults: {},
  description: 'This is a full testimonial video'
};
exports.full = full;
var snippet = {
  label: 'Testimonial Snippet',
  required_items: ['logo', 'cta', 'song'],
  defaults: {},
  description: 'This is a testimonial snippet'
};
exports.snippet = snippet;
var notATemplate = (0, _freeze.default)({
  label: 'Not a Template',
  defaults: {},
  required_items: ['cta'],
  description: 'This is not a tempate'
});
exports.notATemplate = notATemplate;
var DELIVERABLE_BLUEPRINTS = (0, _freeze.default)({
  FULL_TESTIMONIAL: full,
  TESTIMONIAL_SNIPPET: snippet,
  NOT_A_TEMPLATE: notATemplate
});
var _default = DELIVERABLE_BLUEPRINTS;
exports.default = _default;