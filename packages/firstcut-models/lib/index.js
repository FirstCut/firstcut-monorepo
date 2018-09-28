"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = _interopRequireDefault(require("./models"));

var _publications = _interopRequireDefault(require("./utils/publications"));

if (Meteor.isServer) {
  (0, _publications.default)(_models.default);
}

var _default = _models.default;
exports.default = _default;