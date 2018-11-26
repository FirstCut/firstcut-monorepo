"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _projectRequest = _interopRequireDefault(require("./project-request"));

var templates = [_projectRequest.default];
var EventHandlerTemplates = templates.reduce(function (r, template) {
  var result = r;
  var key = template.get('key');
  result[key] = template;
  return result;
}, {});
var _default = EventHandlerTemplates;
exports.default = _default;