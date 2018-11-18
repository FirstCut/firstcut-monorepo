"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "initApiMethods", {
  enumerable: true,
  get: function get() {
    return _googleApiMethods.initApiMethods;
  }
});
exports.default = void 0;

var _googleApiAsync = require("./google-api-async");

var _googleApiMethods = require("./google-api-methods");

var _default = _googleApiAsync.GoogleApi;
exports.default = _default;