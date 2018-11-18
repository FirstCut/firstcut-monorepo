"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NumberInput;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _autoform = require("../autoform.utils");

function NumberInput(props) {
  var onChange = props.onChange,
      _props$value = props.value,
      value = _props$value === void 0 ? undefined : _props$value,
      rest = (0, _objectWithoutProperties2.default)(props, ["onChange", "value"]);
  var domProps = (0, _autoform.removeNonDomFields)(rest);

  var onNumberChange = function onNumberChange(e, _ref) {
    var name = _ref.name,
        value = _ref.value;
    var asFloat = parseFloat(value);
    onChange(null, {
      name: name,
      value: asFloat
    });
  };

  return _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
    control: _semanticUiReact.Input,
    onChange: onNumberChange,
    type: "number"
  }, domProps, {
    value: value
  }));
}