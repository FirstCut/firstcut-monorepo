"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = require("firstcut-schema");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _jobs = require("./jobs.enum");

var JobSchema = new _firstcutSchema.SimpleSchemaWrapper({
  _id: String,
  jobName: {
    type: String,
    allowedValues: Object.keys(_jobs.JOBS)
  },
  key: String,
  isRecurring: Boolean,
  event_data: Object,
  'event_data.event': String,
  'event_data.record_id': String,
  'event_data.cut_type_due': String,
  'event_data.record_type': String,
  cron: _simplSchema.default.oneOf(String, Date)
});
var _default = JobSchema;
exports.default = _default;