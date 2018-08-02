"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JOB_KEYS = void 0;

var _freeze = _interopRequireDefault(require("@babel/runtime/core-js/object/freeze"));

var JOB_KEYS = (0, _freeze.default)({
  schedule_shoot_wrap: 'schedule_shoot_wrap',
  schedule_shoot_reminder: 'schedule_shoot_reminder',
  schedule_checkin_checkout_reminder: 'schedule_checkin_checkout_reminder',
  schedule_footage_verification: 'schedule_footage_verification'
});
exports.JOB_KEYS = JOB_KEYS;