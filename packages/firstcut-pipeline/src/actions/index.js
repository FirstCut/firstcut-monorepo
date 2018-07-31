
import UpcomingShootReminder from './upcoming-shoot-reminder.js';
import SnippetCreated from './snippet-created.js';
import ShootWrap from './shoot-wrap.js';
import FeedbackSubmittedByClient from './feedback-submitted-by-client.js';
import InvoicePaid from './invoice-paid.js';
import FootageVerified from './footage-verified.js';
import CutDueEventUpdated from './cut-due-event-updated.js';
import SnippetRequested from './snippet-requested.js';
import FootageVerificationReminder from './footage-verification-reminder.js';
import ScreenshotApproved from './screenshot-approved.js';
import ScreenshotRejected from './screenshot-rejected.js';
import RecordCreated from './record-created.js';
import ShootCheckin from './shoot-checkin.js';
import ShootCheckout from './shoot-checkout.js';
import UpdatedShootEvent from './shoot-event-updated.js';
import CollaboratorRemoved from './collaborator-removed.js';
import CollaboratorAdded from './collaborator-added.js';
import SendInviteLink from './send-invite-link.js';
import PreproductionKickoff from './preproduction-kickoff.js';
import DeliverableKickoff from './deliverable-kickoff.js';
import CutUploaded from './cut-uploaded.js';
import SendCutToClient from './send-cut-to-client.js';
import CutSentToClient from './cut-sent-to-client.js';
import CutApprovedByClient from './cut-approved.js';
import RevisionsSent from './revisions-sent.js';
import ProjectWrap from './project-wrap.js';
import ScreenshotUploaded from './screenshot-uploaded.js';
import ConfirmFootageUpload from './confirm-footage-upload.js';
import CheckinCheckoutReminder from './checkin-checkout-reminder.js';
import ApplicationSubmitted from './application-submitted.js';
import ErrorEvent from './error-event.js';

const templates = [
  ErrorEvent,
  ApplicationSubmitted,
  ConfirmFootageUpload,
  DeliverableKickoff,
  CheckinCheckoutReminder,
  ScreenshotRejected,
  ScreenshotUploaded,
  ProjectWrap,
  RevisionsSent,
  CutApprovedByClient,
  CutSentToClient,
  SendCutToClient,
  CutUploaded,
  PreproductionKickoff,
  CollaboratorAdded,
  SendInviteLink,
  CollaboratorRemoved,
  UpdatedShootEvent,
  RecordCreated,
  ShootCheckout,
  ShootCheckin,
  ScreenshotApproved,
  FootageVerificationReminder,
  SnippetRequested,
  CutDueEventUpdated,
  UpcomingShootReminder,
  ShootWrap,
  FeedbackSubmittedByClient,
  SnippetCreated,
  InvoicePaid,
  FootageVerified,
];

const ActionTemplates = templates.reduce((result, template) => {
  const key = template.get('key');
  result[key] = template;
  return result;
}, {});

export default ActionTemplates;
