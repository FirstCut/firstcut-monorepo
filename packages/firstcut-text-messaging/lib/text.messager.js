"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendTextMessage = sendTextMessage;
exports.SUPPORTED_COUNTRIES = void 0;

var _twilio = _interopRequireDefault(require("twilio"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _firstcutUtils = require("firstcut-utils");

var SUPPORTED_COUNTRIES = ['United States', 'United Kingdom'];
exports.SUPPORTED_COUNTRIES = SUPPORTED_COUNTRIES;

function getFromNumber(country) {
  if (Meteor.settings.public.environment == 'development') {
    return '+15005550006';
  } else if (country == 'United Kingdom') {
    return '+441133203346';
  }

  {
    return '+17162190340';
  }
}

function sendTextMessage(_ref) {
  var to = _ref.to,
      body = _ref.body,
      country = _ref.country;
  new _simplSchema.default({
    to: {
      type: String,
      regEx: _simplSchema.default.RegEx.phone
    },
    body: String,
    country: {
      type: String,
      allowedValues: SUPPORTED_COUNTRIES,
      optional: true
    }
  }).validate({
    to: to,
    body: body,
    country: country
  });
  var sid = Meteor.settings.twilio.sid;
  var authToken = Meteor.settings.twilio.authToken;
  var client = (0, _twilio.default)(sid, authToken);
  var from = getFromNumber(country);
  to = (0, _firstcutUtils.removePunctuation)(to);
  return client.messages.create({
    body: body,
    from: from,
    to: to
  });
}