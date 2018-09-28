"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SUPPORTED_TIMEZONES = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var SUPPORTED_TIMEZONES = _momentTimezone.default.tz.names();

exports.SUPPORTED_TIMEZONES = SUPPORTED_TIMEZONES;