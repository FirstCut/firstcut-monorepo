"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChannel = getChannel;
exports.postMessage = postMessage;

var _meteor = require("meteor/meteor");

var _client = require("@slack/client");

var _slackSchemas = require("./slack.schemas.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var access_token = _meteor.Meteor.settings.slack.api_token;
var slack = new _client.WebClient(access_token);
var client_id = _meteor.Meteor.settings.slack.client_id;
var client_secret = _meteor.Meteor.settings.slack.client_secret;

function getChannel() {
  if (_meteor.Meteor.isTest) {
    return 'devtesting';
  } else if (_meteor.Meteor.settings.public.environment == 'development') {
    return 'devtesting';
  } else if (_meteor.Meteor.settings.public.environment == 'production') {
    return 'postproduction';
  } else {
    throw _meteor.Meteor.Error('unsatisfied-conditions', 'Could not retrieve channel. Is not test, development, or production environment.');
  }
}

function postMessage(content, channel) {
  if (!channel || _meteor.Meteor.settings.public.environment == 'development') {
    channel = getChannel();
  }

  var result = _objectSpread({
    channel: channel
  }, content);

  _slackSchemas.SlackContentSchema.validate(result);

  return slack.chat.postMessage(result);
}