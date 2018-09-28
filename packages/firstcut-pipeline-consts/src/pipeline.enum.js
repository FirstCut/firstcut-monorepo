
export const FALLBACK_PHONE_NUMBER = '';

export const COLLABORATOR_TYPES_TO_LABELS = Object.freeze({
  interviewer: 'Interviewer',
  videographer: 'Videographer',
  adminOwner: 'Admin Owner',
  postpoOwner: 'PostProduction Owner',
  clientOwner: 'Client Owner',
});

export const JOB_KEYS = Object.freeze({
  schedule_reminder_to_set_cut_due: 'schedule_reminder_to_set_cut_due',
  schedule_reminder_to_get_feedback: 'schedule_reminder_to_get_feedback',
  schedule_cut_due_reminder: 'schedule_cut_due_reminder',
  schedule_shoot_wrap: 'schedule_shoot_wrap',
  schedule_shoot_reminder: 'schedule_shoot_reminder',
  schedule_checkin_checkout_reminder: 'schedule_checkin_checkout_reminder',
  schedule_footage_verification: 'schedule_footage_verification',
});

export const ACTIONS = Object.freeze({
  send_email: 'send_email',
  slack_notify: 'slack_notify',
  charge_invoice: 'charge_invoice',
  trigger_action: 'trigger_action',
  schedule_job: 'schedule_job',
  text_message: 'text_message',
  calendar_event: 'calendar_event',
  custom_function: 'custom_function',
});

export const SUPPORTED_ACTIONS = Object.values(ACTIONS);
