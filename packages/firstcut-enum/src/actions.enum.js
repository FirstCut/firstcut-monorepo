
/* EVENTUALLY THESE NEED TO BE API CALLS SO THEY CAN BE DYNAMICALLY GENERATED.
TURN THESE INTO API CALLS ONCE YOU NEED TO EDIT THESE */

export const SUPPORTED_EVENTS = [];

export const EVENTS = { };

export const EVENT_LABELS = { };

export const EVENT_ACTION_TITLES = { };

export const FALLBACK_PHONE_NUMBER = '';

export const ACTIONS = Object.freeze({
  send_email: 'send_email',
  slack_notify: 'slack_notify',
  schedule_job: 'schedule_job',
  text_message: 'text_message',
  calendar_event: 'calendar_event',
  custom_function: 'custom_function'
});
