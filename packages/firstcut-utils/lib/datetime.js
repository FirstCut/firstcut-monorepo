"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUTC = isUTC;
exports.humanReadableDate = humanReadableDate;
exports.fromNowDate = fromNowDate;
exports.userTimezone = userTimezone;
exports.DATE_FORMATS = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var DATE_FORMATS = Object.freeze({
  verbose: 'dddd, MMMM Do YYYY, h:mm:ss a z',
  short: 'MMM Do',
  // Apr 20th,
  'short-full-month': 'MMMM Do',
  'short-with-time': 'MMM Do h:mm a',
  clean: 'lll',
  // Apr 20, 1986 8:30 PM
  google: 'YYYY-MM-DDTHH:mm:ss',
  formal_day: 'YYYY-MM-DD',
  time: 'HH:mm A'
});
exports.DATE_FORMATS = DATE_FORMATS;
var DEFAULT_FORMAT = 'verbose';

function isUTC(date) {
  return (0, _momentTimezone.default)(date).isUTC();
}

function humanReadableDate(_ref) {
  var date = _ref.date,
      timezone = _ref.timezone,
      format = _ref.format,
      enddate = _ref.enddate;

  if (!format) {
    format = DEFAULT_FORMAT;
  }

  timezone = timezone || userTimezone();

  var result = _formattedDate({
    date: date,
    timezone: timezone,
    format: format
  });

  if (enddate) {
    var formattedEndDate = _formattedDate({
      date: enddate,
      timezone: timezone,
      format: 'time'
    });

    result = "".concat(result, " - ").concat(formattedEndDate);
  }

  return result;
}

function fromNowDate(_ref2) {
  var date = _ref2.date,
      timezone = _ref2.timezone;
  timezone = timezone || userTimezone();
  return (0, _momentTimezone.default)(date).fromNow();
}

function userTimezone() {
  return _momentTimezone.default.tz.guess();
}

function _formattedDate(_ref3) {
  var date = _ref3.date,
      timezone = _ref3.timezone,
      format = _ref3.format;
  return (0, _momentTimezone.default)(date).tz(timezone).format(DATE_FORMATS[format]);
}