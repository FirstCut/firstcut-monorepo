"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TriggerActionSchema = exports.CustomFunctionSchema = exports.ScheduleJobSchema = exports.ChargeInvoiceSchema = exports.SlackActionSchema = exports.CalendarActionSchema = exports.TextMessageActionSchema = exports.EmailActionSchema = void 0;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _firstcutSlack = require("firstcut-slack");

var _firstcutCalendar = require("firstcut-calendar");

var _pipeline = require("./pipeline.enum");

var EmailActionSchema = new _simplSchema.default({
  substitution_data: {
    type: Object,
    blackbox: true
  },
  template: {
    type: String
  },
  to: Array,
  'to.$': {
    type: String,
    regEx: _simplSchema.default.RegEx.email
  },
  cc: {
    type: Array,
    optional: true
  },
  'cc.$': {
    optional: true,
    type: String,
    regEx: _simplSchema.default.RegEx.email
  },
  type: {
    type: String,
    allowedValues: [_pipeline.ACTIONS.send_email]
  }
});
exports.EmailActionSchema = EmailActionSchema;
var TextMessageActionSchema = new _simplSchema.default({
  body: String,
  to: {
    type: String,
    regEx: _simplSchema.default.RegEx.phone
  },
  type: {
    type: String,
    allowedValues: [_pipeline.ACTIONS.text_message]
  },
  country: {
    type: String,
    optional: true
  }
});
exports.TextMessageActionSchema = TextMessageActionSchema;
var CalendarActionSchema = new _simplSchema.default({
  event: _firstcutCalendar.CalendarEventContentSchema,
  owner_email: {
    type: String,
    optional: true
  },
  event_id: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    allowedValues: [_pipeline.ACTIONS.calendar_event]
  }
});
exports.CalendarActionSchema = CalendarActionSchema;
var SlackActionSchema = new _simplSchema.default({
  content: _firstcutSlack.SlackContentSchema,
  channel: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    allowedValues: [_pipeline.ACTIONS.slack_notify]
  }
});
exports.SlackActionSchema = SlackActionSchema;
var ChargeInvoiceSchema = new _simplSchema.default({
  type: {
    type: String,
    allowedValues: [_pipeline.ACTIONS.charge_invoice]
  }
});
exports.ChargeInvoiceSchema = ChargeInvoiceSchema;
var ScheduleJobSchema = new _simplSchema.default({
  type: {
    type: String,
    allowedValues: [_pipeline.ACTIONS.schedule_job]
  },
  title: String,
  job: {
    type: Object,
    blackbox: true,
    custom: function custom() {
      var job = this.value;

      try {
        job.schema.validate(job.toJS());
      } catch (e) {
        return 'Not a valid job object';
      }

      return undefined;
    }
  }
});
exports.ScheduleJobSchema = ScheduleJobSchema;
var CustomFunctionSchema = new _simplSchema.default({
  title: String,
  type: {
    type: String,
    allowedValues: [_pipeline.ACTIONS.custom_function]
  },
  execute: {
    type: Object,
    custom: function custom() {
      var func = this.value;

      if (typeof func !== 'function') {
        return 'Execute must be a function';
      }

      return undefined;
    }
  }
});
exports.CustomFunctionSchema = CustomFunctionSchema;
var TriggerActionSchema = new _simplSchema.default({
  type: {
    type: String,
    allowedValues: [_pipeline.ACTIONS.trigger_action]
  },
  title: String,
  event_data: {
    type: Object,
    blackbox: true
  },
  'event_data.event': String,
  'event_data.record_id': String,
  'event_data.record_type': String
});
exports.TriggerActionSchema = TriggerActionSchema;
var ActionSchemas = {
  slack_notify: SlackActionSchema,
  calendar_event: CalendarActionSchema,
  text_message: TextMessageActionSchema,
  send_email: EmailActionSchema,
  charge_invoice: ChargeInvoiceSchema,
  trigger_action: TriggerActionSchema,
  schedule_job: ScheduleJobSchema,
  custom_function: CustomFunctionSchema
};
var _default = ActionSchemas;
exports.default = _default;