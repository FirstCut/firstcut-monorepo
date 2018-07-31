"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Label;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Label(props) {
  var _props = _objectSpread({}, props),
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