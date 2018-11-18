import SimpleSchema from 'simpl-schema';
import { SlackContentSchema } from 'firstcut-slack';
import { CalendarEventContentSchema } from 'firstcut-calendar';
import { ACTIONS } from './pipeline.enum';

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
  owner_email: {
    type: String,
    optional: true,
  },
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

export const ChargeInvoiceSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: [ACTIONS.charge_invoice],
  },
});

export const ScheduleJobSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: [ACTIONS.schedule_job],
  },
  title: String,
  job: {
    type: Object,
    blackbox: true,
    custom() {
      const job = this.value;
      try {
        job.schema.validate(job.toJS());
      } catch (e) {
        return 'Not a valid job object';
      }
      return undefined;
    },
  },
});

export const CustomFunctionSchema = new SimpleSchema({
  title: String,
  type: {
    type: String,
    allowedValues: [ACTIONS.custom_function],
  },
  execute: {
    type: Object,
    custom() {
      const func = this.value;
      if (typeof func !== 'function') {
        return 'Execute must be a function';
      }
      return undefined;
    },
  },
});

export const TriggerActionSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: [ACTIONS.trigger_action],
  },
  title: String,
  event_data: {
    type: Object,
    blackbox: true,
  },
  'event_data.event': String,
  'event_data.record_id': String,
  'event_data.record_type': String,
});

const ActionSchemas = {
  slack_notify: SlackActionSchema,
  calendar_event: CalendarActionSchema,
  text_message: TextMessageActionSchema,
  send_email: EmailActionSchema,
  charge_invoice: ChargeInvoiceSchema,
  trigger_action: TriggerActionSchema,
  schedule_job: ScheduleJobSchema,
  custom_function: CustomFunctionSchema,
};

export default ActionSchemas;
