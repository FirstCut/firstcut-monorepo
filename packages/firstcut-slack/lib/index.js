"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SlackContentSchema", {
  enumerable: true,
  get: function get() {
    return _slack2.SlackContentSchema;
  }
});
exports.Slack = void 0;

var _slack = require("./slack");

var _slack2 = require("./slack.schemas");

var Slack = {
  postMessage: _slack.postMessage
};
exports.Slack = Slack;