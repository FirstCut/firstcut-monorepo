
import UpcomingShootReminder from './upcoming-shoot-reminder';
import ShootWrap from './shoot-wrap';
import FeedbackSubmittedByClient from './feedback-submitted-by-client';
import InvoicePaid from './invoice-paid';
import FootageVerified from './footage-verified';
import CutDueEventUpdated from './cut-due-event-updated';
import FootageVerificationReminder from './footage-verification-reminder';
import ScreenshotApproved from './screenshot-approved';
import ScreenshotRejected from './screenshot-rejected';
import RecordCreated from './record-created';
import ShootCheckin from './shoot-checkin';
import ShootCheckout from './shoot-checkout';
import UpdatedShootEvent from './shoot-event-updated';
import CollaboratorRemoved from './collaborator-removed';
import CollaboratorAdded from './collaborator-added';
import SendInviteLink from './send-invite-link';
import GenerateBookingInvoices from './generate-booking-invoices';
import PreproductionKickoff from './preproduction-kickoff';
import ShootReady from './shoot-ready';
import DeliverableKickoff from './deliverable-kickoff';
import CutUploaded from './cut-uploaded';
import SendCutToClient from './send-cut-to-client';
import CutSentToClient from './cut-sent-to-client';
import CutApprovedByClient from './cut-approved';
import RevisionsSent from './feedback-sent';
import ProjectWrap from './project-wrap';
import ScreenshotUploaded from './screenshot-uploaded';
import ConfirmFootageUpload from './confirm-footage-upload';
import CheckinCheckoutReminder from './checkin-checkout-reminder';
import EditShootScript from './edit-shoot-script';
import ApplicationSubmitted from './application-submitted';
import CutDueReminder from './cut-due-reminder';
import SendFeedbackReminder from './send-feedback-reminder';
import ReminderToSetCutDue from './reminder-to-set-cut-due';
import InvoiceSetToDue from './invoice-set-to-due';
import ErrorEvent from './error-event';
import FootageBatchUploaded from './footage-batch-uploaded';
import FootageUploadInitiated from './footage-upload-initiated';
import MarkTaskAsComplete from './mark-task-as-complete';
import ChargeClient from './charge-client';
import InviteToEditScript from './invite-to-edit-script';
import ReminderToGetClientFeedback from './reminder-to-get-client-feedback';
import EditFeedback from './edit-feedback';
import AddOnRequested from './addon-requested';
import ProjectHandoff from './project-handoff';

const templates = [
  ErrorEvent,
  EditFeedback,
  ChargeClient,
  EditShootScript,
  ReminderToGetClientFeedback,
  InvoiceSetToDue,
  AddOnRequested,
  FootageBatchUploaded,
  InviteToEditScript,
  FootageUploadInitiated,
  ProjectHandoff,
  ApplicationSubmitted,
  ReminderToSetCutDue,
  CutDueReminder,
  MarkTaskAsComplete,
  SendFeedbackReminder,
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
  ShootReady,
  PreproductionKickoff,
  CollaboratorAdded,
  SendInviteLink,
  CollaboratorRemoved,
  UpdatedShootEvent,
  RecordCreated,
  ShootReady,
  ShootCheckout,
  ShootCheckin,
  ScreenshotApproved,
  FootageVerificationReminder,
  CutDueEventUpdated,
  UpcomingShootReminder,
  ShootWrap,
  FeedbackSubmittedByClient,
  GenerateBookingInvoices,
  InvoicePaid,
  FootageVerified,
];

const ActionTemplates = templates.reduce((r, template) => {
  const result = r;
  const key = template.get('key');
  result[key] = template;
  return result;
}, {});

export default ActionTemplates;
