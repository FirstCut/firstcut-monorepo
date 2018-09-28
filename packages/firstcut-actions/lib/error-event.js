"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _immutable = require("immutable");

var _action = require("./shared/action.schemas");

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
        text: "ERROR: ".concat((0, _stringify.default)(event_data))
      }
    }];
  }
});
var _default = ErrorEvent;
exports.default = _default;