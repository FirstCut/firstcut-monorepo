"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateKey = getTemplateKey;
exports.getTemplate = getTemplate;
exports.getActionsForEvent = getActionsForEvent;

var _handlerTemplates = _interopRequireDefault(require("./handler-templates"));

function getTemplateKey(t) {
  return t.get('key');
}

function getTemplate(key) {
  return _handlerTemplates.default[key];
}

function getActionsForEvent(data) {
  var event = data.event;
  return getTemplate(event).get('generateActions')(data);
}