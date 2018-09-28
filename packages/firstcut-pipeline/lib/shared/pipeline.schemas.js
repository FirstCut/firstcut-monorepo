"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlackActionSchema = exports.CalendarActionSchema = exports.TextMessageActionSchema = exports.EmailActionSchema = void 0;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _slack = require("/imports/api/slack");

var _calendar = require("/imports/api/calendar");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

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
    allowedValues: [_firstcutPipelineConsts.ACTIONS.send_email]
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
    allowedValues: [_firstcutPipelineConsts.ACTIONS.text_message]
  },
  country: {
    type: String,
    optional: true
  }
});
exports.TextMessageActionSchema = TextMessageActionSchema;
var CalendarActionSchema = new _simplSchema.default({
  event: _calendar.CalendarEventContentSchema,
  event_id: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    allowedValues: [_firstcutPipelineConsts.ACTIONS.calendar_event]
  }
});
exports.CalendarActionSchema = CalendarActionSchema;
var SlackActionSchema = new _simplSchema.default({
  content: _slack.SlackContentSchema,
  channel: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    allowedValues: [_firstcutPipelineConsts.ACTIONS.slack_notify]
  }
});
exports.SlackActionSchema = SlackActionSchema;