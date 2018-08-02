"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
Object.defineProperty(exports, "getEventActionsAsDescriptiveString", {
  enumerable: true,
  get: function get() {
    return _execute.getEventActionsAsDescriptiveString;
  }
});
Object.defineProperty(exports, "initSubscriptions", {
  enumerable: true,
  get: function get() {
    return _pubsub.default;
  }
});

var _execute = require("./execute.actions");

var _pubsub = _interopRequireDefault(require("./pubsub"));

// import {Meteor} from 'meteor/meteor';
console.log('Init subscriptions in the pipeline');
console.log(_pubsub.default);