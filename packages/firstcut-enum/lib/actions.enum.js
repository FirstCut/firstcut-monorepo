"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTIONS = exports.FALLBACK_PHONE_NUMBER = exports.EVENT_ACTION_TITLES = exports.EVENT_LABELS = exports.EVENTS = exports.SUPPORTED_EVENTS = void 0;

/* EVENTUALLY THESE NEED TO BE API CALLS SO THEY CAN BE DYNAMICALLY GENERATED.
TURN THESE INTO API CALLS ONCE YOU NEED TO EDIT THESE */
var SUPPORTED_EVENTS = [];
exports.SUPPORTED_EVENTS = SUPPORTED_EVENTS;
var EVENTS = {};
exports.EVENTS = EVENTS;
var EVENT_LABELS = {};
exports.EVENT_LABELS = EVENT_LABELS;
var EVENT_ACTION_TITLES = {};
exports.EVENT_ACTION_TITLES = EVENT_ACTION_TITLES;
var FALLBACK_PHONE_NUMBER = '';
exports.FALLBACK_PHONE_NUMBER = FALLBACK_PHONE_NUMBER;
var ACTIONS = Object.freeze({
  send_email: 'send_email',
  slack_notify: 'slack_notify',
  schedule_job: 'schedule_job',
  text_message: 'text_message',
  calendar_event: 'calendar_event',
  custom_function: 'custom_function'
});
exports.ACTIONS = ACTIONS;