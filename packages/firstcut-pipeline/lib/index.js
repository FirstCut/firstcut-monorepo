"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
Object.defineProperty(exports, "handleEvent", {
  enumerable: true,
  get: function get() {
    return _execute.handleEvent;
  }
});

var _execute = require("./execute.actions");

var _pubsub = _interopRequireDefault(require("./server/pubsub"));

// import {Meteor} from 'meteor/meteor';
// this is silly. why
function init(Models) {
  (0, _pubsub.default)(Models);
}