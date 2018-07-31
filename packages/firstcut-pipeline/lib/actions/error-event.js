"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _pipelineSchemas = require("../shared/pipeline.schemas.js");

var _pipelineEnum = require("../shared/pipeline.enum.js");

var ErrorEvent = new _immutable.Map({
  key: 'error',
  action_title: 'Error',
  completed_title: 'Error',
  fulfillsPrerequisites: function fulfillsPrerequisites(_ref) {
    var record = _ref.record,
        initiator = _ref.initiator;
  },
  generateActions: function generateActions(event_data) {
    console.log(event_data);
    return [{
      type: _pipelineEnum.ACTIONS.slack_notify,
      channel: 'app-errors',
      content: {
        text: "ERROR: ".concat(JSON.stringify(event_data))
      }
    }];
  }
});
var _default = ErrorEvent;
exports.default = _default;