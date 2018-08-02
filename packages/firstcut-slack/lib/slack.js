"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChannel = getChannel;
exports.postMessage = postMessage;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _client = require("@slack/client");

var _slackSchemas = require("./slack.schemas.js");

var access_token = Meteor.settings.slack.api_token;
var slack = new _client.WebClient(access_token);
var client_id = Meteor.settings.slack.client_id;
var client_secret = Meteor.settings.slack.client_secret;

function getChannel() {
  if (Meteor.isTest) {
    return 'devtesting';
  } else if (Meteor.settings.public.environment == 'development') {
    return 'devtesting';
  } else if (Meteor.settings.public.environment == 'production') {
    return 'postproduction';
  } else {
    throw Meteor.Error('unsatisfied-conditions', 'Could not retrieve channel. Is not test, development, or production environment.');
  }
}

function postMessage(content, channel) {
  if (!channel || Meteor.settings.public.environment == 'development') {
    channel = getChannel();
  }

  var result = (0, _objectSpread2.default)({
    channel: channel
  }, content);

  _slackSchemas.SlackContentSchema.validate(result);

  return slack.chat.postMessage(result);
}