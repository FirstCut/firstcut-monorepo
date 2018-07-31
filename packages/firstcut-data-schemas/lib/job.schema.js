"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

var _firstcutEnum = require("firstcut-enum");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JobSchema = new _firstcutSchemaBuilder.FCSchema({
  _id: String,
  jobName: {
    type: String,
    allowedValues: Object.keys(_firstcutEnum.JOB_KEYS)
  },
  key: String,
  isRecurring: Boolean,
  event_data: Object,
  "event_data.event": String,
  "event_data.record_id": String,
  "event_data.record_type": String,
  cron: _simplSchema.default.oneOf(String, Date)
});
var _default = JobSchema;
exports.default = _default;