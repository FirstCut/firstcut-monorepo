"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAutoformSchema;

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _firstcutModels = require("firstcut-models");

var _immutable = require("immutable");

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

var DEFAULT_SORT_METHOD = 'text';

function getAutoformSchema(schema, field, options) {
  var _options$errors = options.errors,
      errors = _options$errors === void 0 ? {} : _options$errors,
      _options$overrides = options.overrides,
      overrides = _options$overrides === void 0 ? {} : _options$overrides;
  var field_schema = (0, _objectSpread2.default)({}, overrides[field], schema.getFieldSchema(field));
  var result = {
    type: _getAutoformType(schema, field, field_schema),
    name: _getAutoformFieldName(schema, field),
    label: schema.getFieldLabel(field)
  };
  result.error = _getError(errors, field);
  result.options = _getOptions(field_schema);
  result.placeholder = _getPlaceholder(field_schema);
  result.help_text = _getHelpText(field_schema);
  result.single_file = _acceptsSingleFile(field_schema);
  result.sortBy = field_schema.sortBy ? field_schema.sortBy : DEFAULT_SORT_METHOD;
  result = (0, _objectSpread2.default)({}, field_schema, result); // if (field_schema.defaultValue) {
  //   result.defaultValue = field_schema.defaultValue;
  // }
  // if (field_schema.hidden) {
  //   result.hidden = field_schema.hidden;
  // }
  // if (field_schema.additionLabel) {
  //   result.additionLabel = field_schema.additionLabel;
  // }

  return result;
}

function _getAutoformFieldName(schema, field) {
  if (schema.isSubobjectArrayField(field)) {
    return _firstcutSchemaBuilder.SchemaParser.getMostNestedFieldName(field);
  } else {
    return field;
  }
}

function _acceptsSingleFile(field_schema) {
  return field_schema.customType && field_schema.customType == 'file';
}

function _getAutoformType(schema, field, field_schema) {
  if (field_schema.customType) {
    return field_schema.customType;
  }

  if (_fieldHasOptions(field, field_schema)) {
    return 'options';
  }

  return schema.getQuickTypeForKey(field);
}

function _fieldHasOptions(field, field_schema) {
  return field_schema.options || field_schema.serviceDependency || field_schema.enumOptions;
}

function _getOptions(field_schema) {
  if (_hasPredefinedOptions(field_schema)) {
    return _predefinedOptions(field_schema);
  } else if (_hasEnum(field_schema)) {
    return _generateEnumOptions(field_schema);
  } else if (_hasExternalServiceOptions(field_schema)) {
    return _externalServiceOptions(field_schema);
  } else {
    return null;
  }
}

function _hasEnum(field_schema) {
  return field_schema.enumOptions != null;
}

function _generateEnumOptions(field_schema) {
  return (0, _immutable.List)((0, _keys.default)(field_schema.enumOptions).map(function (t) {
    return {
      key: t,
      value: t,
      text: field_schema.enumOptions[t]
    };
  }));
}

function _hasPredefinedOptions(field_schema) {
  return field_schema.options != null;
}

function _predefinedOptions(field_schema) {
  return field_schema.options();
}

function _hasExternalServiceOptions(field_schema) {
  return field_schema.serviceDependency != null;
}

function _externalServiceOptions(field_schema) {
  var service = field_schema.serviceDependency;
  return service ? _toDropDownOptions(service, field_schema.serviceFilter) : null;
}

function _getPlaceholder(field_schema) {
  return field_schema.placeholder ? field_schema.placeholder : null;
}

function _getError(errors, field) {
  return errors[field] ? errors[field] : null;
}

function _getHelpText(field_schema) {
  return field_schema.helpText ? field_schema.helpText : null;
}

function _applyExtras(result, field, overrides) {
  var field_extras = overrides[field];

  if (field_extras) {
    (0, _keys.default)(field_extras).forEach(function (e) {
      result[e] = field_extras[e];
    });
  }

  return result;
}

function _toDropDownOptions(service_key) {
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _firstcutModels.Models[service_key].find(filter).map(function (p) {
    return {
      key: p._id,
      value: p._id,
      text: p.displayName
    };
  });
}