"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendSlackNotification = sendSlackNotification;
exports.ACTIONS = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _firstcutSlack = _interopRequireDefault(require("firstcut-slack"));

// defines what action types are supported -- soon to include calendar events, emails, etc
var ACTIONS = {
  SLACK_NOTIFY: 'slack_notify'
};
exports.ACTIONS = ACTIONS;
var slackClient = new _firstcutSlack.default({
  defaultChannel: 'projectrequests',
  accessToken: process.env.SLACK_ACCESS_TOKEN
});
var slackTemplateDefaults = {
  username: 'firstcut',
  link_names: true
};

function sendSlackNotification(action) {
  return new Promise(function (resolve, reject) {
    var content = action.content;
    var channel = action.channel;
    content = (0, _objectSpread2.default)({}, slackTemplateDefaults, content);
    slackClient.postMessage(content, channel).then(function (res) {
      return resolve({});
    }).catch(reject);
  });
}