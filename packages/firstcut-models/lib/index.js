"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "initModels", {
  enumerable: true,
  get: function get() {
    return _models.initModels;
  }
});
exports.default = void 0;

var _models = _interopRequireWildcard(require("./models"));

var _publications = _interopRequireDefault(require("./utils/publications"));

if (Meteor.isServer) {
  (0, _publications.default)(_models.default);
}

var _default = _models.default;
exports.default = _default;