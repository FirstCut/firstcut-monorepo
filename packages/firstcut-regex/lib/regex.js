"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var RegEx = {
  Email: _simplSchema.default.RegEx.Email,
  Phone: _simplSchema.default.RegEx.Phone,
  Url: _simplSchema.default.RegEx.Url
};
var _default = RegEx;
exports.default = _default;