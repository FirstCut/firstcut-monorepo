"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SUPPORTED_ACTIONS = exports.ACTIONS = exports.JOB_KEYS = exports.COLLABORATOR_TYPES_TO_LABELS = exports.FALLBACK_PHONE_NUMBER = void 0;
var FALLBACK_PHONE_NUMBER = '';
exports.FALLBACK_PHONE_NUMBER = FALLBACK_PHONE_NUMBER;
var COLLABORATOR_TYPES_TO_LABELS = Object.freeze({
  interviewer: 'Interviewer',
  videographer: 'Videographer',
  adminOwner: 'Admin Owner',
  postpoOwner: 'PostProduction Owner',
  clientOwner: 'Client Owner'
});
exports.COLLABORATOR_TYPES_TO_LABELS = COLLABORATOR_TYPES_TO_LABELS;
var JOB_KEYS = Object.freeze({
  schedule_reminder_to_set_cut_due: 'schedule_reminder_to_set_cut_due',
  schedule_reminder_to_get_feedback: 'schedule_reminder_to_get_feedback',
  schedule_cut_due_reminder: 'schedule_cut_due_reminder',
  schedule_shoot_wrap: 'schedule_shoot_wrap',
  schedule_shoot_reminder: 'schedule_shoot_reminder',
  schedule_checkin_checkout_reminder: 'schedule_checkin_checkout_reminder',
  schedule_footage_verification: 'schedule_footage_verification'
});
exports.JOB_KEYS = JOB_KEYS;
var ACTIONS = Object.freeze({
  send_email: 'send_email',
  slack_notify: 'slack_notify',
  charge_invoice: 'charge_invoice',
  trigger_action: 'trigger_action',
  schedule_job: 'schedule_job',
  text_message: 'text_message',
  calendar_event: 'calendar_event',
  custom_function: 'custom_function'
});
exports.ACTIONS = ACTIONS;
var SUPPORTED_ACTIONS = Object.values(ACTIONS);
exports.SUPPORTED_ACTIONS = SUPPORTED_ACTIONS;