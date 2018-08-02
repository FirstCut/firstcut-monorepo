"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Checkbox;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _immutable = require("immutable");

var _semanticUiReact = require("semantic-ui-react");

function Checkbox(props) {
  var _props = (0, _objectSpread2.default)({}, props),
      value = _props.value,
      onChange = _props.onChange,
      field_props = (0, _objectWithoutProperties2.default)(_props, ["value", "onChange"]);

  var onCheckboxChange = function onCheckboxChange(onChange, name, prev_value) {
    return function (e) {
      var new_value = !prev_value;
      onChange(e, {
        name: name,
        value: new_value
      });
    };
  };

  if (value) {
    field_props.checked = true;
  }

  field_props.onChange = onCheckboxChange(onChange, props.name, value);
  return _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
    control: _semanticUiReact.Checkbox
  }, field_props));
}