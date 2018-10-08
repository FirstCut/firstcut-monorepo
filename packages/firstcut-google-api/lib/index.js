"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _googleApiAsync = require("./google-api-async");

var _googleApiMethods = require("./google-api-methods");

var initialized = false;
Meteor.startup(function () {
  if (!initialized) {
    (0, _googleApiMethods.initApiMethods)();
    initialized = true;
  }
});
var _default = _googleApiAsync.GoogleApi;
exports.default = _default;