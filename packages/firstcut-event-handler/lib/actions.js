"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendSlackNotification = sendSlackNotification;
exports.ActionSchemas = exports.SlackActionSchema = exports.ACTIONS = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _firstcutSlack = _interopRequireDefault(require("firstcut-slack"));

var _firstcutSchema = _interopRequireDefault(require("firstcut-schema"));

var _lodash = require("lodash");

// defines what action types are supported -- soon to include calendar events, emails, etc
var ACTIONS = {
  SLACK_NOTIFY: 'slack_notify'
};
exports.ACTIONS = ACTIONS;

var typeRegex = _lodash._.values(ACTIONS).reduce(function (res, a, i) {
  if (i === 0) {
    return a;
  }

  return "".concat(res, "|").concat(a);
}, '');

var SlackActionSchema = new _firstcutSchema.default({
  required: ['type'],
  properties: {
    content: {
      required: ['text'],
      properties: {
        channel: {
          type: 'string'
        },
        text: {
          type: 'string'
        },
        as_user: {
          type: 'string'
        },
        link_names: {
          type: 'string'
        },
        mrkdwn: {
          type: 'boolean'
        }
      }
    },
    channel: {
      type: 'string'
    },
    type: {
      type: 'string',
      pattern: typeRegex
    }
  }
});
exports.SlackActionSchema = SlackActionSchema;
var ActionSchemas = (0, _defineProperty2.default)({}, ACTIONS.SLACK_NOTIFY, SlackActionSchema);
exports.ActionSchemas = ActionSchemas;
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