"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutMeteor = require("firstcut-meteor");

var _firstcutUploader = require("firstcut-uploader");

var _asset = _interopRequireDefault(require("./asset"));

_firstcutMeteor.Meteor.startup(function () {
  if (_firstcutMeteor.Meteor.isClient) {
    (0, _firstcutUploader.initUploader)();
  }
});

var _default = _asset.default;
exports.default = _default;