"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Select;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _lodash = require("lodash");

function Select(props) {
  var _props = (0, _objectSpread2.default)({}, props),
      options = _props.options,
      additionLabel = _props.additionLabel,
      fieldProps = (0, _objectWithoutProperties2.default)(_props, ["options", "additionLabel"]);

  if (!options) {
    return _react.default.createElement("div", null);
  }

  var sorted = _lodash._.sortBy(options, function (item) {
    return item[props.sortBy] ? item[props.sortBy].toLowerCase() : null;
  });

  sorted.unshift({
    key: '',
    value: null,
    text: ''
  });

  if (additionLabel) {
    return _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
      control: _semanticUiReact.Select,
      search: true,
      allowAdditions: true,
      additionLabel: additionLabel,
      options: sorted
    }, fieldProps));
  }

  return _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
    control: _semanticUiReact.Select,
    search: true,
    options: sorted
  }, fieldProps));
}