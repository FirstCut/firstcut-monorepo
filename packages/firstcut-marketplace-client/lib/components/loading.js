"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _firstcutUi = require("firstcut-ui");

/**
 * Loading
 *
 * Generic loading component
 */
function Loading(props) {
  return _react.default.createElement(_firstcutUi.Icon, {
    loading: true,
    name: "spinner"
  });
}

var _default = Loading;
exports.default = _default;