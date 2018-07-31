"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SUPPORTED_TIMEZONES = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SUPPORTED_TIMEZONES = _momentTimezone.default.tz.names();

exports.SUPPORTED_TIMEZONES = SUPPORTED_TIMEZONES;