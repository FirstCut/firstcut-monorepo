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

function Select(props) {
  var _props = (0, _objectSpread2.default)({}, props),
      options = _props.options,
      additionLabel = _props.additionLabel,
      field_props = (0, _objectWithoutProperties2.default)(_props, ["options", "additionLabel"]);

  if (!options) {
    return _react.default.createElement("div", null);
  }

  var with_null_options = options.unshift({
    key: '',
    value: null,
    text: ''
  });

  var sorted = _.sortBy(with_null_options.toArray(), function (item) {
    return item[props.sortBy] ? item[props.sortBy].toLowerCase() : null;
  });

  if (additionLabel) {
    return _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
      control: _semanticUiReact.Select,
      search: true,
      allowAdditions: true,
      additionLabel: additionLabel,
      options: sorted
    }, field_props));
  } else {
    return _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
      control: _semanticUiReact.Select,
      search: true,
      options: sorted
    }, field_props));
  }
}