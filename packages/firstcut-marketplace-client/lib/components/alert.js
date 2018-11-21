"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _firstcutUi = require("firstcut-ui");

function Alert(props) {
  return _react.default.createElement(_firstcutUi.Modal, {
    header: props.header,
    content: props.message
  });
}

Alert.propTypes = {
  message: _propTypes.default.string,
  header: _propTypes.default.string
};
var _default = Alert;
exports.default = _default;