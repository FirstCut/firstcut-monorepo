"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SUPPORTED_ACTIONS = exports.ACTIONS = exports.JOB_KEYS = exports.COLLABORATOR_TYPES_TO_LABELS = exports.FALLBACK_PHONE_NUMBER = void 0;
var FALLBACK_PHONE_NUMBER = '';
exports.FALLBACK_PHONE_NUMBER = FALLBACK_PHONE_NUMBER;
var COLLABORATOR_TYPES_TO_LABELS = Object.freeze({
  'interviewer': 'Interviewer',
  'videographer': 'Videographer',
  'adminOwner': 'Admin Owner',
  'postpoOwner': 'PostProduction Owner',
  'clientOwner': 'Client Owner'
});
exports.COLLABORATOR_TYPES_TO_LABELS = COLLABORATOR_TYPES_TO_LABELS;
var JOB_KEYS = Object.freeze({
  schedule_shoot_wrap: 'schedule_shoot_wrap',
  schedule_shoot_reminder: 'schedule_shoot_reminder',
  schedule_checkin_checkout_reminder: 'schedule_checkin_checkout_reminder',
  schedule_footage_verification: 'schedule_footage_verification'
});
exports.JOB_KEYS = JOB_KEYS;
var ACTIONS = Object.freeze({
  send_email: 'send_email',
  slack_notify: 'slack_notify',
  schedule_job: 'schedule_job',
  text_message: 'text_message',
  calendar_event: 'calendar_event',
  custom_function: 'custom_function'
}); // /* DO NOT MODIFY THESE LABELS -- labels are saved in DB */
// export const EVENTS = Object.freeze({
//   snippet_created: 'snippet_created',
//   snippet_requested: 'snippet_requested',
//   send_cut_to_client: 'send_cut_to_client',
//   send_invite_link: 'send_invite_link',
//   preproduction_kickoff: 'preproduction_kickoff',
//   invoice_paid: 'invoice_paid',
//   shoot_checkout: 'shoot_checkout',
//   shoot_wrap: 'shoot_wrap',
//   shoot_checkin: 'shoot_checkin',
//   screenshot_uploaded: 'screenshot_uploaded',
//   deliverable_kickoff: 'deliverable_kickoff',
//   project_wrap: 'project_wrap',
//   cut_uploaded: 'cut_uploaded',
//   has_been_sent_to_client: 'has_been_sent_to_client',
//   feedback_submitted_by_client: 'feedback_submitted_by_client',
//   revisions_sent: 'revisions_sent',
//   cut_approved_by_client: 'cut_approved_by_client',
//   collaborator_added: 'collaborator_added',
//   collaborator_removed: 'collaborator_removed',
//   screenshot_approved: 'screenshot_approved',
//   screenshot_rejected: 'screenshot_rejected',
//   upcoming_shoot_reminder: 'upcoming_shoot_reminder',
//   shoot_event_updated: 'shoot_event_updated',
//   footage_verification_reminder: 'footage_verification_reminder',
//   cut_due_event_updated: 'cut_due_event_updated',
//   record_created: 'record_created',
//   error: 'error',
//   footage_verified: 'footage_verified'
// });
//
// export const EVENT_LABELS = Object.freeze({
//   error: 'Error',
//   preproduction_kickoff: 'Preproduction Kickoff',
//   snippet_created: 'Snippet Created',
//   snippet_requested: 'Snippet Requested',
//   feedback_submitted_by_client: 'Revisions Submitted By Client',
//   send_invite_link: 'Sent Invite Link',
//   send_cut_to_client: 'Send Cut To Client',
//   invoice_paid: 'Invoice Paid',
//   shoot_checkout: 'Checked Out Of Shoot',
//   shoot_checkin: 'Checked In To Shoot',
//   shoot_wrap: 'Shoot Wrap',
//   screenshot_uploaded: 'Screenshot Uploaded',
//   deliverable_kickoff: 'Deliverable Kickoff',
//   cut_uploaded: 'Cut Uploaded',
//   has_been_sent_to_client: 'Sent To Client',
//   revisions_sent: 'Feedback Sent',
//   cut_approved_by_client: 'Cut Approved By Client',
//   cut_due_event_updated: 'Cut Due Date Updated',
//   project_wrap: 'Project Wrap',
//   collaborator_added: 'Collaborator Added',
//   collaborator_removed: 'Collaborator Removed',
//   screenshot_approved: 'Screenshot Approved',
//   screenshot_rejected: 'Screenshot Rejected',
//   shoot_event_updated: 'Shoot Event Changed',
//   upcoming_shoot_reminder: 'Upcoming Shoot Reminder',
//   footage_verification_reminder: 'Footage Should Be Verified Reminder',
//   record_created: 'Record Created',
//   footage_verified: 'Footage Verified',
// });
//
// export const SUPPORTED_EVENTS = Object.values(EVENTS);

exports.ACTIONS = ACTIONS;
var SUPPORTED_ACTIONS = Object.values(ACTIONS); // export const DAYS_UNTIL_NEXT_CUT_DUE = 3;

exports.SUPPORTED_ACTIONS = SUPPORTED_ACTIONS;