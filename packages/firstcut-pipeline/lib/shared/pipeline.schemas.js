"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlackActionSchema = exports.CalendarActionSchema = exports.TextMessageActionSchema = exports.EmailActionSchema = exports.RecordEvents = exports.ScreenshotEvents = exports.EventSchema = void 0;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _firstcutSlack = require("firstcut-slack");

var _firstcutCalendar = require("firstcut-calendar");

var _firstcutEnum = require("firstcut-enum");

var EventSchema = new _simplSchema.default({
  event: String,
  record_type: {
    type: String,
    optional: true
  },
  initiator_player_id: {
    type: String,
    optional: true
  }
});
exports.EventSchema = EventSchema;
var ScreenshotEvents = new _simplSchema.default({
  record_id: String,
  screenshot: Object,
  "screenshot.filename": String,
  "screenshot.userId": String,
  "screenshot.version": Number,
  "screenshot.cameraId": String,
  "screenshot.approved": Boolean,
  "screenshot.notes": String
}, {
  requiredByDefault: false
}).extend(EventSchema);
exports.ScreenshotEvents = ScreenshotEvents;
var RecordEvents = new _simplSchema.default({
  record_id: String
}).extend(EventSchema); // const EventDataSchemas = Object.freeze({
//   [EVENTS.snippet_created]: new SimpleSchema({
//     snippet_key: String,
//     start: String,
//     end: String
//   }).extend(EventSchema).extend(RecordEvents),
//   [EVENTS.snippet_requested]: new SimpleSchema({
//     start: String,
//     end: String
//   }).extend(EventSchema).extend(RecordEvents),
//   [EVENTS.record_created]: RecordEvents,
//   [EVENTS.confirm_footage_uploaded]: RecordEvents,
//   [EVENTS.screenshot_uploaded]: ScreenshotEvents,
//   [EVENTS.screenshot_approved]: ScreenshotEvents,
//   [EVENTS.screenshot_rejected]: ScreenshotEvents,
//   [EVENTS.shoot_event_updated]: RecordEvents,
//   [EVENTS.cut_due_event_updated]: RecordEvents,
//   [EVENTS.shoot_checkin]: new SimpleSchema({
//     record_id: String,
//     collaborator_key: {
//       type: String,
//       allowedValues: SUPPORTED_RECIPIENTS
//     }
//   }).extend(EventSchema),
//   [EVENTS.shoot_checkout]: new SimpleSchema({
//     record_id: String,
//     collaborator_key: {
//       type: String,
//       allowedValues: SUPPORTED_RECIPIENTS
//     }
//   }).extend(EventSchema),
//   [EVENTS.deliverable_kickoff]: RecordEvents,
//   [EVENTS.shoot_wrap]: RecordEvents,
//   [EVENTS.preproduction_kickoff]: RecordEvents,
//   [EVENTS.collaborator_added]: new SimpleSchema({
//     gig_id: String,
//     gig_type: String,
//     record_id: String,
//     collaborator_key: {
//       type: String,
//       allowedValues: SUPPORTED_RECIPIENTS
//     }
//   }).extend(EventSchema),
//   [EVENTS.collaborator_removed]: new SimpleSchema({
//     gig_id: String,
//     gig_type: String,
//     record_id: String,
//     collaborator_key: {
//       type: String,
//       allowedValues: SUPPORTED_RECIPIENTS
//     }
//   }).extend(EventSchema),
//   [EVENTS.cut_uploaded]: RecordEvents,
//   [EVENTS.has_been_sent_to_client]: RecordEvents,
//   [EVENTS.feedback_submitted_by_client]: RecordEvents,
//   [EVENTS.revisions_sent]: RecordEvents,
//   [EVENTS.cut_approved_by_client]: RecordEvents,
//   [EVENTS.project_wrap]: RecordEvents,
//   [EVENTS.upcoming_shoot_reminder]: RecordEvents,
//   [EVENTS.footage_verified]: RecordEvents,
//   [EVENTS.footage_verification_reminder]: RecordEvents,
//   [EVENTS.invoice_paid]: RecordEvents,
//   [EVENTS.send_invite_link]: RecordEvents,
// });
//

exports.RecordEvents = RecordEvents;
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
  type: {
    type: String,
    allowedValues: [_firstcutEnum.ACTIONS.send_email]
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
    allowedValues: [_firstcutEnum.ACTIONS.text_message]
  },
  country: {
    type: String,
    optional: true
  }
});
exports.TextMessageActionSchema = TextMessageActionSchema;
var CalendarActionSchema = new _simplSchema.default({
  event: _firstcutCalendar.CalendarEventContentSchema,
  event_id: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    allowedValues: [_firstcutEnum.ACTIONS.calendar_event]
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
    allowedValues: [_firstcutEnum.ACTIONS.slack_notify]
  }
});
exports.SlackActionSchema = SlackActionSchema;