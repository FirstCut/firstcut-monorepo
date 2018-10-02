"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
Object.defineProperty(exports, "fulfillsPrerequisites", {
  enumerable: true,
  get: function get() {
    return _execute.fulfillsPrerequisites;
  }
});
Object.defineProperty(exports, "handleEvent", {
  enumerable: true,
  get: function get() {
    return _execute.handleEvent;
  }
});
Object.defineProperty(exports, "getCustomFieldsSchema", {
  enumerable: true,
  get: function get() {
    return _execute.getCustomFieldsSchema;
  }
});
Object.defineProperty(exports, "getEventActionsAsDescriptiveString", {
  enumerable: true,
  get: function get() {
    return _execute.getEventActionsAsDescriptiveString;
  }
});

var _execute = require("./execute.actions");

var _pubsub = _interopRequireDefault(require("./server/pubsub"));

// import {Meteor} from 'firstcut-meteor';
// this is silly. why
function init() {
  (0, _pubsub.default)();
}