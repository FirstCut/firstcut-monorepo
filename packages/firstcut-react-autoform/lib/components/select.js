"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Select;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _lodash = require("lodash");

var _autoform = require("../autoform.utils");

function Select(props) {
  var options = props.options,
      additionLabel = props.additionLabel,
      sortBy = props.sortBy,
      rest = (0, _objectWithoutProperties2.default)(props, ["options", "additionLabel", "sortBy"]);

  if (!options) {
    return _react.default.createElement("div", null);
  }

  var fieldProps = (0, _autoform.removeNonDomFields)(rest);

  var sorted = _lodash._.sortBy(options, function (item) {
    return item[sortBy] ? item[sortBy].toLowerCase() : null;
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