"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RecordEvents = exports.ScreenshotEvents = exports.EventSchema = void 0;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

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
  'screenshot.filename': String,
  'screenshot.userId': String,
  'screenshot.version': Number,
  'screenshot.cameraId': String,
  'screenshot.approved': Boolean,
  'screenshot.notes': String
}, {
  requiredByDefault: false
}).extend(EventSchema);
exports.ScreenshotEvents = ScreenshotEvents;
var RecordEvents = new _simplSchema.default({
  record_id: String
}).extend(EventSchema);
exports.RecordEvents = RecordEvents;