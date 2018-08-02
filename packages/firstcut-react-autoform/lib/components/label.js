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
      help_text = _props.help_text,
      error = _props.error;

  label = error ? label + " -- " + error : label;
  return _react.default.createElement("div", null, label, help_text && _react.default.createElement(_semanticUiReact.Popup, {
    trigger: _react.default.createElement(_semanticUiReact.Icon, {
      name: "question circle"
    })
  }, " ", help_text, " "));
}

Label.propTypes = {
  label: _propTypes.default.string,
  error: _propTypes.default.array,
  help_text: _propTypes.default.string
};