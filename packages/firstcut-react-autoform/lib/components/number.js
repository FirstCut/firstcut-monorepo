"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NumberInput;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

function NumberInput(props) {
  var _props = (0, _objectSpread2.default)({}, props),
      onChange = _props.onChange,
      rest = (0, _objectWithoutProperties2.default)(_props, ["onChange"]);

  var onNumberChange = function onNumberChange(onChange) {
    return function (e, _ref) {
      var name = _ref.name,
          value = _ref.value;
      var asFloat = parseFloat(value);
      onChange(null, {
        name: name,
        value: asFloat
      });
    };
  };

  rest.onChange = onNumberChange(onChange);
  return _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
    control: _semanticUiReact.Input,
    type: "number"
  }, rest));
}