"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var ErrorEvent = new _immutable.Map({
  key: 'error',
  action_title: 'Error',
  completed_title: 'Error',
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    console.log('ERROROROROR');
    console.trace();
    return [{
      type: _firstcutPipelineConsts.ACTIONS.slack_notify,
      channel: 'app-errors',
      content: {
        text: "ERROR: ".concat(JSON.stringify(event_data))
      }
    }];
  }
});
var _default = ErrorEvent;
exports.default = _default;