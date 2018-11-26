"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EVENTS = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

function handleEvent(data) {
  var event = data.event,
      args = (0, _objectWithoutProperties2.default)(data, ["event"]);
} // TODO: auto generate this from event handlers themselves


var EVENTS = {
  PROJECT_REQUEST: 'project_request'
};
exports.EVENTS = EVENTS;
var _default = handleEvent;
exports.default = _default;