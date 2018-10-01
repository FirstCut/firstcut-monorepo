import SimpleSchema from 'simpl-schema';
import { SlackContentSchema } from 'firstcut-slack';
import { CalendarEventContentSchema } from 'firstcut-calendar';
import { ACTIONS } from 'firstcut-pipeline-consts';

export const EmailActionSchema = new SimpleSchema({
  substitution_data: {
    type: Object,
    blackbox: true,
  },
  template: {
    type: String,
  },
  to: Array,
  'to.$': {
    type: String,
    regEx: SimpleSchema.RegEx.email,
  },
  cc: {
    type: Array,
    optional: true,
  },
  'cc.$': {
    optional: true,
    type: String,
    regEx: SimpleSchema.RegEx.email,
  },
  type: {
    type: String,
    allowedValues: [ACTIONS.send_email],
  },
});

export const TextMessageActionSchema = new SimpleSchema({
  body: String,
  to: {
    type: String,
    regEx: SimpleSchema.RegEx.phone,
  },
  type: {
    type: String,
    allowedValues: [ACTIONS.text_message],
  },
  country: {
    type: String,
    optional: true,
  },
});

export const CalendarActionSchema = new SimpleSchema({
  event: CalendarEventContentSchema,
  event_id: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
    allowedValues: [ACTIONS.calendar_event],
  },
});

export const SlackActionSchema = new SimpleSchema({
  content: SlackContentSchema,
  channel: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
    allowedValues: [ACTIONS.slack_notify],
  },
});
