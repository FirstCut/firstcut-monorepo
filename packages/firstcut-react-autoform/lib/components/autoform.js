"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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

var Autoform =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Autoform, _React$Component);

  function Autoform() {
    (0, _classCallCheck2.default)(this, Autoform);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Autoform).apply(this, arguments));
  }

  (0, _createClass2.default)(Autoform, [{
    key: "render",
    value: function render() {
      var disable_defaults = this.props.disable_defaults === undefined ? false : this.props.disable_defaults;
      return _react.default.createElement(_semanticUiReact.Form, null, _react.default.createElement(AutoformFields, (0, _extends2.default)({
        disable_defaults: disable_defaults
      }, this.props)));
    }
  }]);
  return Autoform;
}(_react.default.Component);

exports.default = Autoform;

function AutoformFields(props) {
  var fields = props.fields,
      rest = (0, _objectWithoutProperties2.default)(props, ["fields"]);
  return fields.map(function (field, i) {
    var is_row = field instanceof Array;
    var react_key = "form-group-".concat(i);

    if (is_row) {
      return _react.default.createElement(FieldRow, (0, _extends2.default)({
        key: react_key,
        fields: field
      }, rest));
    }

    return _react.default.createElement(Field, (0, _extends2.default)({
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
  (0, _inherits2.default)(Field, _React$PureComponent);

  function Field() {
    (0, _classCallCheck2.default)(this, Field);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Field).apply(this, arguments));
  }

  (0, _createClass2.default)(Field, [{
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
          field_props = (0, _objectWithoutProperties2.default)(field_schema, ["type", "defaultValue"]);

      if (field_props.hidden) {
        return _react.default.createElement("div", null);
      }

      field_props.label = getLabel((0, _objectSpread2.default)({}, field_props, {
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
          return _react.default.createElement(_semanticUiReact.Form.Field, (0, _extends2.default)({
            control: _semanticUiReact.Input
          }, dom_props));

        case 'boolean':
          return _react.default.createElement(_checkbox.default, field_props);

        case 'number':
          return _react.default.createElement(_number.default, field_props);

        case 'date':
          return _react.default.createElement(_datetime.default, (0, _extends2.default)({}, field_props, {
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
          return _react.default.createElement(_objectarrayForm.default, (0, _extends2.default)({
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