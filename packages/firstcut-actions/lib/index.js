"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _upcomingShootReminder = _interopRequireDefault(require("./upcoming-shoot-reminder"));

var _shootWrap = _interopRequireDefault(require("./shoot-wrap"));

var _feedbackSubmittedByClient = _interopRequireDefault(require("./feedback-submitted-by-client"));

var _invoicePaid = _interopRequireDefault(require("./invoice-paid"));

var _footageVerified = _interopRequireDefault(require("./footage-verified"));

var _cutDueEventUpdated = _interopRequireDefault(require("./cut-due-event-updated"));

var _footageVerificationReminder = _interopRequireDefault(require("./footage-verification-reminder"));

var _screenshotApproved = _interopRequireDefault(require("./screenshot-approved"));

var _screenshotRejected = _interopRequireDefault(require("./screenshot-rejected"));

var _recordCreated = _interopRequireDefault(require("./record-created"));

var _shootCheckin = _interopRequireDefault(require("./shoot-checkin"));

var _shootCheckout = _interopRequireDefault(require("./shoot-checkout"));

var _shootEventUpdated = _interopRequireDefault(require("./shoot-event-updated"));

var _collaboratorRemoved = _interopRequireDefault(require("./collaborator-removed"));

var _collaboratorAdded = _interopRequireDefault(require("./collaborator-added"));

var _sendInviteLink = _interopRequireDefault(require("./send-invite-link"));

var _generateBookingInvoices = _interopRequireDefault(require("./generate-booking-invoices"));

var _preproductionKickoff = _interopRequireDefault(require("./preproduction-kickoff"));

var _shootReady = _interopRequireDefault(require("./shoot-ready"));

var _deliverableKickoff = _interopRequireDefault(require("./deliverable-kickoff"));

var _cutUploaded = _interopRequireDefault(require("./cut-uploaded"));

var _sendCutToClient = _interopRequireDefault(require("./send-cut-to-client"));

var _cutSentToClient = _interopRequireDefault(require("./cut-sent-to-client"));

var _cutApproved = _interopRequireDefault(require("./cut-approved"));

var _feedbackSent = _interopRequireDefault(require("./feedback-sent"));

var _projectWrap = _interopRequireDefault(require("./project-wrap"));

var _screenshotUploaded = _interopRequireDefault(require("./screenshot-uploaded"));

var _confirmFootageUpload = _interopRequireDefault(require("./confirm-footage-upload"));

var _checkinCheckoutReminder = _interopRequireDefault(require("./checkin-checkout-reminder"));

var _editShootScript = _interopRequireDefault(require("./edit-shoot-script"));

var _applicationSubmitted = _interopRequireDefault(require("./application-submitted"));

var _cutDueReminder = _interopRequireDefault(require("./cut-due-reminder"));

var _sendFeedbackReminder = _interopRequireDefault(require("./send-feedback-reminder"));

var _reminderToSetCutDue = _interopRequireDefault(require("./reminder-to-set-cut-due"));

var _invoiceSetToDue = _interopRequireDefault(require("./invoice-set-to-due"));

var _errorEvent = _interopRequireDefault(require("./error-event"));

var _footageBatchUploaded = _interopRequireDefault(require("./footage-batch-uploaded"));

var _footageUploadInitiated = _interopRequireDefault(require("./footage-upload-initiated"));

var _markTaskAsComplete = _interopRequireDefault(require("./mark-task-as-complete"));

var _chargeClient = _interopRequireDefault(require("./charge-client"));

var _inviteToEditScript = _interopRequireDefault(require("./invite-to-edit-script"));

var _reminderToGetClientFeedback = _interopRequireDefault(require("./reminder-to-get-client-feedback"));

var _editFeedback = _interopRequireDefault(require("./edit-feedback"));

var _addonRequested = _interopRequireDefault(require("./addon-requested"));

var _projectHandoff = _interopRequireDefault(require("./project-handoff"));

var templates = [_errorEvent.default, _editFeedback.default, _chargeClient.default, _editShootScript.default, _reminderToGetClientFeedback.default, _invoiceSetToDue.default, _addonRequested.default, _footageBatchUploaded.default, _inviteToEditScript.default, _footageUploadInitiated.default, _projectHandoff.default, _applicationSubmitted.default, _reminderToSetCutDue.default, _cutDueReminder.default, _markTaskAsComplete.default, _sendFeedbackReminder.default, _confirmFootageUpload.default, _deliverableKickoff.default, _checkinCheckoutReminder.default, _screenshotRejected.default, _screenshotUploaded.default, _projectWrap.default, _feedbackSent.default, _cutApproved.default, _cutSentToClient.default, _sendCutToClient.default, _cutUploaded.default, _shootReady.default, _preproductionKickoff.default, _collaboratorAdded.default, _sendInviteLink.default, _collaboratorRemoved.default, _shootEventUpdated.default, _recordCreated.default, _shootReady.default, _shootCheckout.default, _shootCheckin.default, _screenshotApproved.default, _footageVerificationReminder.default, _cutDueEventUpdated.default, _upcomingShootReminder.default, _shootWrap.default, _feedbackSubmittedByClient.default, _generateBookingInvoices.default, _invoicePaid.default, _footageVerified.default];
var ActionTemplates = templates.reduce(function (r, template) {
  var result = r;
  var key = template.get('key');
  result[key] = template;
  return result;
}, {});
var _default = ActionTemplates;
exports.default = _default;