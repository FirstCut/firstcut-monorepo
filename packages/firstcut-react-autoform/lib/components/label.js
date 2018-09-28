"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Label;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

function Label(props) {
  var _props = (0, _objectSpread2.default)({}, props),
      label = _props.label,
      helpText = _props.helpText,
      error = _props.error;

  label = error ? label + " -- " + error : label;
  return _react.default.createElement("div", null, label, helpText && _react.default.createElement(_semanticUiReact.Popup, {
    trigger: _react.default.createElement(_semanticUiReact.Icon, {
      name: "question circle"
    })
  }, " ", helpText, " "));
}

Label.propTypes = {
  label: _propTypes.default.string,
  error: _propTypes.default.array,
  helpText: _propTypes.default.string
};