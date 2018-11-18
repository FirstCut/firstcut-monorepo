"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Checkbox;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _immutable = require("immutable");

var _semanticUiReact = require("semantic-ui-react");

var _autoform = require("../autoform.utils");

function Checkbox(props) {
  var onChange = props.onChange,
      name = props.name;

  var _removeNonDomFields = (0, _autoform.removeNonDomFields)(props),
      value = _removeNonDomFields.value,
      fieldProps = (0, _objectWithoutProperties2.default)(_removeNonDomFields, ["value"]);

  var onCheckboxChange = function onCheckboxChange(prevValue) {
    return function (e) {
      var newValue = !prevValue;
      onChange(e, {
        name: name,
        value: newValue
      });
    };
  };

  if (value) {
    fieldProps.checked = true;
  }

  fieldProps.onChange = onCheckboxChange(value);
  return _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
    control: _semanticUiReact.Checkbox
  }, fieldProps, {
    name: name
  }));
}