"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ObjectArrayForm;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _immutable = require("immutable");

var _buttons = _interopRequireDefault(require("/imports/ui/components/utils/buttons.jsx"));

var _schema = require("/imports/api/schema");

var _firstcutModels = require("firstcut-models");

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function ObjectArrayForm(props) {
  addSubobjectToSubarray = function addSubobjectToSubarray(e) {
    var field = props.fieldname;
    var new_record = props.record.addSubobjectToSubarray(field, {});
    updateField(e, new_record[field]);
  };

  removeSubobjectFromSubarray = function removeSubobjectFromSubarray(index) {
    return function (e) {
      var field = props.fieldname;
      var new_record = props.record.removeSubobjectFromSubarray(field, index);
      updateField(e, new_record[field]);
    };
  };

  var addNewButton = function addNewButton() {
    return _react.default.createElement(_buttons.default.AddNew, {
      type: "button",
      onClick: addSubobjectToSubarray
    });
  };

  var removeButton = function removeButton(index) {
    return function () {
      return _react.default.createElement(_buttons.default.Delete, {
        type: "button",
        onClick: removeSubobjectFromSubarray(index)
      });
    };
  };

  var onInputChange = function onInputChange(index, onChange) {
    return function (e, _ref) {
      var name = _ref.name,
          value = _ref.value;
      var new_value = props.value.setIn([index, name], value);
      updateField(e, new_value);
    };
  };

  var updateField = function updateField(e, new_value) {
    props.onChange(e, {
      name: props.fieldname,
      value: new_value
    });
  };

  var subobject = function subobject(obj, index, props) {
    var renderFields = props.renderFields,
        onChange = props.onChange,
        record = props.record,
        fieldname = props.fieldname,
        rest = _objectWithoutProperties(props, ["renderFields", "onChange", "record", "fieldname"]);

    rest.onChange = onInputChange(index, onChange);
    var errors = getNestedErrors(fieldname, index, props.errors);

    var field_props = _objectSpread({}, rest, {
      errors: errors
    });

    return _react.default.createElement(_semanticUiReact.Segment, null, _react.default.cloneElement(renderFields, _objectSpread({
      record: obj,
      key: fieldname,
      fields: obj.schema.objectKeys()
    }, field_props)), removeButton(index)());
  };

  var objects = props.record.get(props.fieldname);
  return _react.default.createElement("div", null, _react.default.createElement(_semanticUiReact.Divider, {
    horizontal: true
  }, props.label, " "), props.value && props.value.map(function (o, index) {
    return subobject(o, index, props);
  }), addNewButton());
}

function getNestedErrors(fieldname, index, errors) {
  var nested = {};

  var key_to_nested_value = _schema.SchemaParser.fieldAsIndexedObjectArrayKey(fieldname, index);

  _lodash._.mapKeys(errors, function (value, key) {
    var parsed = _schema.SchemaParser.parseNestedFields(key);

    var nested_key = key.split(key_to_nested_value);

    if (nested_key.length > 0) {
      nested_key = _lodash._.last(nested_key);
      nested[nested_key] = _lodash._.last(value);
    }
  });

  return nested;
}