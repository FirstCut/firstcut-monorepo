"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _firstcutUi = require("firstcut-ui");

/**
 * Alert
 *
 * Displays an alert to the user
 */
function Alert(props) {
  var header = props.header,
      message = props.message,
      _props$visible = props.visible,
      visible = _props$visible === void 0 ? true : _props$visible;
  return _react.default.createElement(_firstcutUi.Modal, {
    open: visible,
    header: header,
    content: message
  });
}

Alert.propTypes = {
  message: _propTypes.default.string,
  header: _propTypes.default.string,
  visible: _propTypes.default.bool
};
var _default = Alert;
exports.default = _default;