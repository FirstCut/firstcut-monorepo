"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Select;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function Select(props) {
  var _props = _objectSpread({}, props),
      options = _props.options,
      additionLabel = _props.additionLabel,
      field_props = _objectWithoutProperties(_props, ["options", "additionLabel"]);

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
    return _react.default.createElement(_semanticUiReact.Form.Field, _extends({
      control: _semanticUiReact.Select,
      search: true,
      allowAdditions: true,
      additionLabel: additionLabel,
      options: sorted
    }, field_props));
  } else {
    return _react.default.createElement(_semanticUiReact.Form.Field, _extends({
      control: _semanticUiReact.Select,
      search: true,
      options: sorted
    }, field_props));
  }
}