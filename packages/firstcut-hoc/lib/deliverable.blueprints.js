"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.not_a_template = exports.snippet = exports.full = void 0;
var full = {
  label: 'Full Testimonial Video',
  defaults: {
    estimatedDuration: 120 //in seconds

  },
  required_items: ['logo', 'cta', 'song'],
  description: "This is a full testimonial video"
};
exports.full = full;
var snippet = {
  label: 'Testimonial Snippet',
  defaults: {
    estimatedDuration: 30 //in seconds

  },
  required_items: ['logo', 'cta', 'song'],
  description: "This is a testimonial snippet"
};
exports.snippet = snippet;
var not_a_template = Object.freeze({
  label: 'Not a Template',
  defaults: {
    estimatedDuration: 120 //in seconds

  },
  required_items: ['cta'],
  description: "This is not a tempate"
});
exports.not_a_template = not_a_template;