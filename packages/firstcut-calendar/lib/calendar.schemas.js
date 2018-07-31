"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalendarEventContentSchema = void 0;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CalendarEventContentSchema = new _simplSchema.default({
  'summary': String,
  'location': String,
  'description': String,
  'start': Object,
  'start.dateTime': String,
  'start.date': String,
  'start.timeZone': String,
  'end': Object,
  'end.dateTime': String,
  'end.date': String,
  'end.timeZone': String,
  'attendees': Array,
  'attendees.$': Object,
  'attendees.$.email': {
    type: String,
    regEx: _simplSchema.default.RegEx.email
  }
}, {
  requiredByDefault: false
});
exports.CalendarEventContentSchema = CalendarEventContentSchema;