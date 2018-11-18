"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ObjectArrayForm;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _firstcutSchema = require("firstcut-schema");

var _lodash = require("lodash");

function ObjectArrayForm(props) {
  var addSubobjectToSubarray = function addSubobjectToSubarray(e) {
    var field = props.fieldname;
    var newRecord = props.record.addSubobjectToSubarray(field, {});
    updateField(e, newRecord[field]);
  };

  var removeSubobjectFromSubarray = function removeSubobjectFromSubarray(index) {
    return function (e) {
      var field = props.fieldname;
      var newRecord = props.record.removeSubobjectFromSubarray(field, index);
      updateField(e, newRecord[field]);
    };
  };

  var removeButton = function removeButton(index) {
    return function () {
      return _react.default.createElement(_semanticUiReact.Button, {
        type: "button",
        onClick: removeSubobjectFromSubarray(index),
        icon: "trash",
        color: "red"
      });
    };
  };

  var onInputChange = function onInputChange(index, onChange) {
    return function (e, _ref) {
      var name = _ref.name,
          value = _ref.value;
      var newValue = props.value.setIn([index, name], value);
      updateField(e, newValue);
    };
  };

  var updateField = function updateField(e, newValue) {
    props.onChange(e, {
      name: props.fieldname,
      value: newValue
    });
  };

  var subobject = function subobject(obj, index, props) {
    var renderFields = props.renderFields,
        onChange = props.onChange,
        record = props.record,
        fieldname = props.fieldname,
        rest = (0, _objectWithoutProperties2.default)(props, ["renderFields", "onChange", "record", "fieldname"]);
    rest.onChange = onInputChange(index, onChange);
    var errors = getNestedErrors(fieldname, index, props.errors);
    var fieldProps = (0, _objectSpread2.default)({}, rest, {
      errors: errors
    });
    return _react.default.createElement(_semanticUiReact.Segment, {
      key: fieldname + index
    }, _react.default.cloneElement(renderFields, (0, _objectSpread2.default)({
      record: obj,
      key: fieldname,
      fields: obj.schema.objectKeys()
    }, fieldProps)), removeButton(index)());
  };

  return _react.default.createElement("div", null, _react.default.createElement(_semanticUiReact.Divider, {
    horizontal: true
  }, props.label, ' '), props.value && props.value.map(function (o, index) {
    return subobject(o, index, props);
  }), _react.default.createElement(_semanticUiReact.Button, {
    type: "button",
    onClick: addSubobjectToSubarray,
    icon: "plus",
    color: "green"
  }));
}

function getNestedErrors(fieldname, index, errors) {
  var nested = {};

  var keyToNestedValue = _firstcutSchema.SchemaParser.fieldAsIndexedObjectArrayKey(fieldname, index);

  _lodash._.mapKeys(errors, function (value, key) {
    var nestedKey = key.split(keyToNestedValue);

    if (nestedKey.length > 0) {
      nestedKey = _lodash._.last(nestedKey);
      nested[nestedKey] = _lodash._.last(value);
    }
  });

  return nested;
}