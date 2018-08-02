"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _upcomingShootReminder = _interopRequireDefault(require("./upcoming-shoot-reminder.js"));

var _snippetCreated = _interopRequireDefault(require("./snippet-created.js"));

var _shootWrap = _interopRequireDefault(require("./shoot-wrap.js"));

var _feedbackSubmittedByClient = _interopRequireDefault(require("./feedback-submitted-by-client.js"));

var _invoicePaid = _interopRequireDefault(require("./invoice-paid.js"));

var _footageVerified = _interopRequireDefault(require("./footage-verified.js"));

var _cutDueEventUpdated = _interopRequireDefault(require("./cut-due-event-updated.js"));

var _snippetRequested = _interopRequireDefault(require("./snippet-requested.js"));

var _footageVerificationReminder = _interopRequireDefault(require("./footage-verification-reminder.js"));

var _screenshotApproved = _interopRequireDefault(require("./screenshot-approved.js"));

var _screenshotRejected = _interopRequireDefault(require("./screenshot-rejected.js"));

var _recordCreated = _interopRequireDefault(require("./record-created.js"));

var _shootCheckin = _interopRequireDefault(require("./shoot-checkin.js"));

var _shootCheckout = _interopRequireDefault(require("./shoot-checkout.js"));

var _shootEventUpdated = _interopRequireDefault(require("./shoot-event-updated.js"));

var _collaboratorRemoved = _interopRequireDefault(require("./collaborator-removed.js"));

var _collaboratorAdded = _interopRequireDefault(require("./collaborator-added.js"));

var _sendInviteLink = _interopRequireDefault(require("./send-invite-link.js"));

var _preproductionKickoff = _interopRequireDefault(require("./preproduction-kickoff.js"));

var _deliverableKickoff = _interopRequireDefault(require("./deliverable-kickoff.js"));

var _cutUploaded = _interopRequireDefault(require("./cut-uploaded.js"));

var _sendCutToClient = _interopRequireDefault(require("./send-cut-to-client.js"));

var _cutSentToClient = _interopRequireDefault(require("./cut-sent-to-client.js"));

var _cutApproved = _interopRequireDefault(require("./cut-approved.js"));

var _revisionsSent = _interopRequireDefault(require("./revisions-sent.js"));

var _projectWrap = _interopRequireDefault(require("./project-wrap.js"));

var _screenshotUploaded = _interopRequireDefault(require("./screenshot-uploaded.js"));

var _confirmFootageUpload = _interopRequireDefault(require("./confirm-footage-upload.js"));

var _checkinCheckoutReminder = _interopRequireDefault(require("./checkin-checkout-reminder.js"));

var _applicationSubmitted = _interopRequireDefault(require("./application-submitted.js"));

var _errorEvent = _interopRequireDefault(require("./error-event.js"));

var templates = [_errorEvent.default, _applicationSubmitted.default, _confirmFootageUpload.default, _deliverableKickoff.default, _checkinCheckoutReminder.default, _screenshotRejected.default, _screenshotUploaded.default, _projectWrap.default, _revisionsSent.default, _cutApproved.default, _cutSentToClient.default, _sendCutToClient.default, _cutUploaded.default, _preproductionKickoff.default, _collaboratorAdded.default, _sendInviteLink.default, _collaboratorRemoved.default, _shootEventUpdated.default, _recordCreated.default, _shootCheckout.default, _shootCheckin.default, _screenshotApproved.default, _footageVerificationReminder.default, _snippetRequested.default, _cutDueEventUpdated.default, _upcomingShootReminder.default, _shootWrap.default, _feedbackSubmittedByClient.default, _snippetCreated.default, _invoicePaid.default, _footageVerified.default];
var ActionTemplates = templates.reduce(function (result, template) {
  var key = template.get('key');
  result[key] = template;
  return result;
}, {});
var _default = ActionTemplates;
exports.default = _default;