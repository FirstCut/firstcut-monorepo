"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SlackContentSchema", {
  enumerable: true,
  get: function get() {
    return _slackSchemas.SlackContentSchema;
  }
});
exports.Slack = void 0;

var _slack = require("./slack.js");

var _slackSchemas = require("./slack.schemas.js");

var Slack = {
  postMessage: _slack.postMessage
};
exports.Slack = Slack;