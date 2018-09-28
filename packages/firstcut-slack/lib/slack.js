"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChannel = getChannel;
exports.postMessage = postMessage;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _meteor = require("meteor/meteor");

var _client = require("@slack/client");

var _slack = require("./slack.schemas");

var access_token = _meteor.Meteor.settings.slack.api_token;
var slack = new _client.WebClient(access_token);
var client_id = _meteor.Meteor.settings.slack.client_id;
var client_secret = _meteor.Meteor.settings.slack.client_secret;

function getChannel() {
  if (_meteor.Meteor.isTest) {
    return 'devtesting';
  }

  if (_meteor.Meteor.settings.public.environment == 'development') {
    return 'devtesting';
  }

  if (_meteor.Meteor.settings.public.environment == 'production') {
    return 'postproduction';
  }

  throw _meteor.Meteor.Error('unsatisfied-conditions', 'Could not retrieve channel. Is not test, development, or production environment.');
}

function postMessage(content, channel) {
  if (!channel || _meteor.Meteor.settings.public.environment == 'development') {
    channel = getChannel();
  }

  var result = (0, _objectSpread2.default)({
    channel: channel
  }, content);

  _slack.SlackContentSchema.validate(result);

  return slack.chat.postMessage(result);
}