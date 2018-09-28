"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAutoformSchema;

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _immutable = require("immutable");

var _schema = require("/imports/api/schema");

var _lodash = require("lodash");

var DEFAULT_SORT_METHOD = 'text';

function getAutoformSchema(record, field, options) {
  var schema = record.schema;
  var _options$errors = options.errors,
      errors = _options$errors === void 0 ? {} : _options$errors,
      _options$overrides = options.overrides,
      overrides = _options$overrides === void 0 ? {} : _options$overrides;
  var fieldSchema = (0, _objectSpread2.default)({}, overrides[field], schema.getFieldSchema(field));
  var label = fieldSchema.label ? fieldSchema.label : schema.getFieldLabel(field);
  var result = {
    type: _getAutoformType(schema, field, fieldSchema),
    name: _getAutoformFieldName(schema, field),
    label: label
  };
  result.defaultValue = _getDefaultValue(fieldSchema, record);
  result.error = _getError(errors, field);
  result.options = _getOptions(fieldSchema);

  if (result.options && result.options.toArray) {
    result.options = result.options.toArray(); // if an immutable list is returned
  }

  result.placeholder = _getPlaceholder(fieldSchema);
  result.helpText = _getHelpText(fieldSchema);
  result.singleFile = _acceptsSingleFile(fieldSchema);
  result.sortBy = fieldSchema.sortBy ? fieldSchema.sortBy : DEFAULT_SORT_METHOD;
  result = (0, _objectSpread2.default)({}, fieldSchema, result);
  return result;
}

function _getDefaultValue(schema, record) {
  if (!schema.defaultValue) {
    return null;
  }

  if (typeof schema.defaultValue === 'function') {
    return schema.defaultValue(record);
  }

  return schema.defaultValue;
}

function _getAutoformFieldName(schema, field) {
  if (schema.isSubobjectArrayField(field)) {
    return _schema.SchemaParser.getMostNestedFieldName(field);
  }

  return field;
}

function _acceptsSingleFile(fieldSchema) {
  return fieldSchema.customType && fieldSchema.customType === 'file';
}

function _getAutoformType(schema, field, fieldSchema) {
  if (fieldSchema.customType) {
    return fieldSchema.customType;
  }

  if (_fieldHasOptions(field, fieldSchema)) {
    return 'options';
  }

  return schema.getQuickTypeForKey(field);
}

function _fieldHasOptions(field, fieldSchema) {
  return fieldSchema.options || fieldSchema.serviceDependency || fieldSchema.enumOptions;
}

function _getOptions(fieldSchema) {
  if (_hasPredefinedOptions(fieldSchema)) {
    return _predefinedOptions(fieldSchema);
  }

  if (_hasEnum(fieldSchema)) {
    return _generateEnumOptions(fieldSchema);
  }

  if (_hasExternalServiceOptions(fieldSchema)) {
    return _externalServiceOptions(fieldSchema);
  }

  return null;
}

function _hasEnum(fieldSchema) {
  return fieldSchema.enumOptions != null;
}

function _generateEnumOptions(fieldSchema) {
  return (0, _immutable.List)((0, _keys.default)(fieldSchema.enumOptions).map(function (t) {
    return {
      key: t,
      value: t,
      text: fieldSchema.enumOptions[t]
    };
  }));
}

function _hasPredefinedOptions(fieldSchema) {
  return fieldSchema.options != null;
}

function _predefinedOptions(fieldSchema) {
  return fieldSchema.options();
}

function _hasExternalServiceOptions(fieldSchema) {
  return fieldSchema.serviceDependency != null;
}

function _externalServiceOptions(fieldSchema) {
  var service = fieldSchema.serviceDependency;
  return service ? _toDropDownOptions(service, fieldSchema.serviceFilter) : null;
}

function _getPlaceholder(fieldSchema) {
  return fieldSchema.placeholder ? fieldSchema.placeholder : null;
}

function _getError(errors, field) {
  return errors[field] ? errors[field] : null;
}

function _getHelpText(fieldSchema) {
  return fieldSchema.helpText ? fieldSchema.helpText : null;
}

function _toDropDownOptions(serviceKey) {
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (Array.isArray(serviceKey)) {
    var options = serviceKey.reduce(function (res, key) {
      return res.concat(_toDropDownOptions(key, filter));
    }, new _immutable.List());
    return options;
  }

  return _firstcutModels.default[serviceKey].find(filter).map(function (p) {
    return {
      key: p._id,
      value: p._id,
      text: p.displayName
    };
  });
}