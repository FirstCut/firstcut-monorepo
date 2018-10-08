"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.notATemplate = exports.snippet = exports.full = void 0;
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
var notATemplate = Object.freeze({
  label: 'Not a Template',
  defaults: {},
  required_items: ['cta'],
  description: 'This is not a tempate'
});
exports.notATemplate = notATemplate;
var DELIVERABLE_BLUEPRINTS = Object.freeze({
  FULL_TESTIMONIAL: full,
  TESTIMONIAL_SNIPPET: snippet,
  NOT_A_TEMPLATE: notATemplate
});
var _default = DELIVERABLE_BLUEPRINTS;
exports.default = _default;