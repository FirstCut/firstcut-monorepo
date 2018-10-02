"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDevelopment = isDevelopment;
Object.defineProperty(exports, "ValidationError", {
  enumerable: true,
  get: function get() {
    return _firstcutMeteor.ValidationError;
  }
});
Object.defineProperty(exports, "HTTP", {
  enumerable: true,
  get: function get() {
    return _firstcutMeteor.HTTP;
  }
});
Object.defineProperty(exports, "Session", {
  enumerable: true,
  get: function get() {
    return _session.Session;
  }
});
Object.defineProperty(exports, "Meteor", {
  enumerable: true,
  get: function get() {
    return _meteor.Meteor;
  }
});

var _firstcutMeteor = require("firstcut-meteor");

var _session = require("meteor/session");

var _meteor = require("meteor/meteor");

function isDevelopment() {
  return _meteor.Meteor.settings.public.environment === 'development';
}

;