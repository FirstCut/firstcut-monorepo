"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Autoform;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _immutable = require("immutable");

var _semanticUiReact = require("semantic-ui-react");

var _moment = _interopRequireDefault(require("moment"));

var _autoform = _interopRequireDefault(require("../autoform.schema"));

var _autoform2 = require("../autoform.utils");

var _objectarray = _interopRequireDefault(require("./objectarray.form"));

var _label = _interopRequireDefault(require("./label"));

var _location = _interopRequireDefault(require("./location"));

var _datetime = _interopRequireDefault(require("./datetime"));

var _checkbox = _interopRequireDefault(require("./checkbox"));

var _dropzone = _interopRequireDefault(require("./dropzone"));

var _select = _interopRequireDefault(require("./select"));

var _number = _interopRequireDefault(require("./number"));

function Autoform(props) {
  var _props$disableDefault = props.disableDefaults,
      disableDefaults = _props$disableDefault === void 0 ? false : _props$disableDefault;
  return _react.default.createElement(_semanticUiReact.Form, null, _react.default.createElement(AutoformFields, (0, _extends2.default)({
    disableDefaults: disableDefaults
  }, props)));
}

function AutoformFields(props) {
  var fields = props.fields,
      rest = (0, _objectWithoutProperties2.default)(props, ["fields"]);
  return fields.map(function (field, i) {
    var isRow = field instanceof Array;
    var reactKey = "form-group-".concat(i);

    if (isRow) {
      return _react.default.createElement(FieldRow, (0, _extends2.default)({
        key: reactKey,
        fields: field
      }, rest));
    }

    return _react.default.createElement(Field, (0, _extends2.default)({
      key: reactKey,
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
      helpText = props.helpText,
      label = props.label,
      error = props.error;

  if (type === 'boolean') {
    return label;
  }

  return _react.default.createElement(_label.default, {
    type: type,
    label: label,
    helpText: helpText,
    error: error
  });
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
          disableDefaults = _this$props.disableDefaults;
      var models = this.props.models;
      var options = {
        errors: errors,
        overrides: overrides
      };

      if (!models) {
        models = record.models;
      }

      var fieldSchema = (0, _autoform.default)(models, record, field, options);

      if (!disableDefaults && !record.get(field) && fieldSchema.defaultValue) {
        // save the default value to the record
        onChange(null, {
          name: field,
          value: fieldSchema.defaultValue
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
          disableDefaults = _this$props2.disableDefaults,
          withFileManager = _this$props2.withFileManager;
      var options = {
        errors: errors,
        overrides: overrides
      };
      var models = this.props.models;

      if (!models) {
        models = record.models;
      }

      var fieldSchema = (0, _autoform.default)(models, record, field, options);
      var type = fieldSchema.type,
          defaultValue = fieldSchema.defaultValue,
          fieldProps = (0, _objectWithoutProperties2.default)(fieldSchema, ["type", "defaultValue"]);

      if (fieldProps.hidden) {
        return _react.default.createElement("div", null);
      }

      fieldProps.label = getLabel((0, _objectSpread2.default)({}, fieldProps, {
        type: type
      }));
      fieldProps.value = record.get(field);

      if (fieldProps.value === '') {
        // do not allow empty string fields, prefer null
        onChange(null, {
          name: field,
          value: null
        });
      }

      if (fieldProps.options && fieldProps.value) {
        var valueIsArray = Array.isArray(fieldProps.value);
        var values = valueIsArray ? fieldProps.value : [fieldProps.value];
        var optionValues = fieldProps.options.map(function (o) {
          return o.key;
        });
        var filteredValues = values.filter(function (val) {
          return optionValues.includes(val);
        });

        if (!_lodash._.isEqual(filteredValues, values)) {
          if (valueIsArray) {
            onChange(null, {
              name: field,
              value: filteredValues
            });
          } else {
            onChange(null, {
              name: field,
              value: null
            });
          }
        }
      }

      fieldProps.record = record;
      fieldProps.fieldname = field;
      fieldProps.name = field;
      fieldProps.onChange = onChange;
      fieldProps.key = "".concat(field);
      var domProps = (0, _autoform2.removeNonDomFields)(fieldProps);

      switch (type) {
        case 'options':
          return _react.default.createElement(_select.default, fieldProps);

        case 'multiselect':
          return _react.default.createElement(_select.default, (0, _extends2.default)({}, fieldProps, {
            multiple: true
          }));

        case 'string':
          console.log('Input');
          return _react.default.createElement(_semanticUiReact.Form.Input, (0, _extends2.default)({}, domProps, {
            value: fieldProps.value || ''
          }));

        case 'boolean':
          return _react.default.createElement(_checkbox.default, fieldProps);

        case 'number':
          return _react.default.createElement(_number.default, fieldProps);

        case 'date':
          // const timezone = record.timezone || getTimezoneFromDate(fieldProps.value);
          return _react.default.createElement(_datetime.default, (0, _extends2.default)({}, fieldProps, {
            timezone: fieldProps.timezone || record.timezone
          }));

        case 'textarea':
          console.log('TEXT ALEA');
          return _react.default.createElement(_semanticUiReact.Form.TextArea, domProps);

        case 'location':
          return _react.default.createElement(_location.default, fieldProps);

        case 'file':
          return _react.default.createElement(_dropzone.default, (0, _extends2.default)({}, fieldProps, {
            withFileManager: withFileManager
          }));

        case 'fileArray':
          return _react.default.createElement(_dropzone.default, (0, _extends2.default)({}, fieldProps, {
            withFileManager: withFileManager
          }));

        case 'objectArray':
          return _react.default.createElement(_objectarray.default, (0, _extends2.default)({
            errors: errors
          }, fieldProps, {
            renderFields: _react.default.createElement(AutoformFields, null)
          }));

        default:
          console.log("you need to implement type ".concat(type));
          return _react.default.createElement("div", null);
        // throw new Meteor.Error('Error field type not in allowed types [String]');
      }
    }
  }]);
  return Field;
}(_react.default.PureComponent);

AutoformFields.propTypes = {
  record: _propTypes.default.instanceOf(_immutable.Record),
  onChange: _propTypes.default.func,
  errors: _propTypes.default.object,
  overrides: _propTypes.default.object,
  fields: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string), _propTypes.default.string]))
};