"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _immutable = require("immutable");

var _semanticUiReact = require("semantic-ui-react");

var _random = require("meteor/random");

var _autoformSchema = _interopRequireDefault(require("../autoform.schema.js"));

var _firstcutUtils = require("firstcut-utils");

var _autoformUtils = require("../autoform.utils.js");

var _objectarrayForm = _interopRequireDefault(require("./objectarray.form.jsx"));

var _label = _interopRequireDefault(require("./label.jsx"));

var _location = _interopRequireDefault(require("./location.jsx"));

var _datetime = _interopRequireDefault(require("./datetime.jsx"));

var _checkbox = _interopRequireDefault(require("./checkbox.jsx"));

var _dropzone = _interopRequireDefault(require("./dropzone.jsx"));

var _select = _interopRequireDefault(require("./select.jsx"));

var _number = _interopRequireDefault(require("./number.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Autoform =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Autoform, _React$Component);

  function Autoform() {
    _classCallCheck(this, Autoform);

    return _possibleConstructorReturn(this, _getPrototypeOf(Autoform).apply(this, arguments));
  }

  _createClass(Autoform, [{
    key: "render",
    value: function render() {
      var disable_defaults = this.props.disable_defaults === undefined ? false : this.props.disable_defaults;
      return _react.default.createElement(_semanticUiReact.Form, null, _react.default.createElement(AutoformFields, _extends({
        disable_defaults: disable_defaults
      }, this.props)));
    }
  }]);

  return Autoform;
}(_react.default.Component);

exports.default = Autoform;

function AutoformFields(props) {
  var fields = props.fields,
      rest = _objectWithoutProperties(props, ["fields"]);

  return fields.map(function (field, i) {
    var is_row = field instanceof Array;
    var react_key = "form-group-".concat(i);

    if (is_row) {
      return _react.default.createElement(FieldRow, _extends({
        key: react_key,
        fields: field
      }, rest));
    }

    return _react.default.createElement(Field, _extends({
      key: react_key,
      field: field
    }, rest));
  });
}

function FieldRow(props) {
  return _react.default.createElement(_semanticUiReact.Form.Group, {
    widths: "equal"
  }, _react.default.createElement(AutoformFields, props));
}

function getLabel(props) {
  var type = props.type,
      help_text = props.help_text,
      label = props.label,
      error = props.error;

  if (type == 'boolean') {
    return label;
  } else {
    return _react.default.createElement(_label.default, {
      type: type,
      label: label,
      help_text: help_text,
      error: error
    });
  }
}

var Field =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Field, _React$PureComponent);

  function Field() {
    _classCallCheck(this, Field);

    return _possibleConstructorReturn(this, _getPrototypeOf(Field).apply(this, arguments));
  }

  _createClass(Field, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          record = _this$props.record,
          field = _this$props.field,
          errors = _this$props.errors,
          overrides = _this$props.overrides,
          disable_defaults = _this$props.disable_defaults;
      var options = {
        errors: errors,
        overrides: overrides
      };
      var field_schema = (0, _autoformSchema.default)(record.schema, field, options);

      if (!disable_defaults && !record.get(field) && field_schema.defaultValue) {
        //save the default value to the record
        onChange(null, {
          name: field,
          value: field_schema.defaultValue
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          record = _this$props2.record,
          field = _this$props2.field,
          onChange = _this$props2.onChange,
          errors = _this$props2.errors,
          overrides = _this$props2.overrides,
          disable_defaults = _this$props2.disable_defaults;
      var options = {
        errors: errors,
        overrides: overrides
      };
      var field_schema = (0, _autoformSchema.default)(record.schema, field, options);

      var type = field_schema.type,
          defaultValue = field_schema.defaultValue,
          field_props = _objectWithoutProperties(field_schema, ["type", "defaultValue"]);

      if (field_props.hidden) {
        return _react.default.createElement("div", null);
      }

      field_props.label = getLabel(_objectSpread({}, field_props, {
        type: type
      }));
      field_props.value = record.get(field);

      if (field_props.value === '') {
        //do not allow empty string fields, prefer null
        onChange(null, {
          name: field,
          value: null
        });
      }

      field_props.record = record;
      field_props.fieldname = field;
      field_props.name = field;
      field_props.onChange = onChange;
      field_props.key = "".concat(field);

      switch (type) {
        case 'options':
          return _react.default.createElement(_select.default, field_props);

        case 'string':
          var dom_props = (0, _autoformUtils.removeNonDomFields)(field_props);
          return _react.default.createElement(_semanticUiReact.Form.Field, _extends({
            control: _semanticUiReact.Input
          }, dom_props));

        case 'boolean':
          return _react.default.createElement(_checkbox.default, field_props);

        case 'number':
          return _react.default.createElement(_number.default, field_props);

        case 'date':
          return _react.default.createElement(_datetime.default, _extends({}, field_props, {
            timezone: record.timezone
          }));

        case 'textarea':
          return _react.default.createElement(_semanticUiReact.Form.TextArea, field_props);

        case 'location':
          return _react.default.createElement(_location.default, field_props);

        case 'file':
          return _react.default.createElement(_dropzone.default, field_props);

        case 'fileArray':
          return _react.default.createElement(_dropzone.default, field_props);

        case 'objectArray':
          return _react.default.createElement(_objectarrayForm.default, _extends({
            errors: errors
          }, field_props, {
            renderFields: _react.default.createElement(AutoformFields, null)
          }));

        default:
          console.log(field_props.name);
          console.log("you need to implement type ".concat(type));
        // throw new Meteor.Error('Error field type not in allowed types [String]');
      }
    }
  }]);

  return Field;
}(_react.default.PureComponent);

AutoformFields.propTypes = {
  record: _propTypes.default.instanceOf(_immutable.Record).isRequired,
  onChange: _propTypes.default.func.isRequired,
  errors: _propTypes.default.object,
  overrides: _propTypes.default.object,
  fields: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string), _propTypes.default.string]))
};