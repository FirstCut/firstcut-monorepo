"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getAddOnPrice", {
  enumerable: true,
  get: function get() {
    return _addons.getAddOnPrice;
  }
});
Object.defineProperty(exports, "ADD_ONS", {
  enumerable: true,
  get: function get() {
    return _addons.ADD_ONS;
  }
});
Object.defineProperty(exports, "FALLBACK_PHONE_NUMBER", {
  enumerable: true,
  get: function get() {
    return _pipeline.FALLBACK_PHONE_NUMBER;
  }
});
Object.defineProperty(exports, "COLLABORATOR_TYPES_TO_LABELS", {
  enumerable: true,
  get: function get() {
    return _pipeline.COLLABORATOR_TYPES_TO_LABELS;
  }
});
Object.defineProperty(exports, "ACTIONS", {
  enumerable: true,
  get: function get() {
    return _pipeline.ACTIONS;
  }
});
Object.defineProperty(exports, "JOB_KEYS", {
  enumerable: true,
  get: function get() {
    return _pipeline.JOB_KEYS;
  }
});
Object.defineProperty(exports, "SUPPORTED_ACTIONS", {
  enumerable: true,
  get: function get() {
    return _pipeline.SUPPORTED_ACTIONS;
  }
});
exports.SUPPORTED_EVENTS = exports.EVENT_LABELS = exports.EVENTS = exports.EVENT_ACTION_TITLES = void 0;

var _addons = require("./addons");

var _pipeline = require("./pipeline.enum");

var EVENT_ACTION_TITLES = require('./event_action_titles.json');

exports.EVENT_ACTION_TITLES = EVENT_ACTION_TITLES;

var EVENT_LABELS = require('./event_labels.json');

exports.EVENT_LABELS = EVENT_LABELS;

var SUPPORTED_EVENTS = require('./supported_events.json');

exports.SUPPORTED_EVENTS = SUPPORTED_EVENTS;

var EVENTS = require('./events.json');

exports.EVENTS = EVENTS;