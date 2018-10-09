
import { List } from 'immutable';
import { SchemaParser } from 'firstcut-schema';
import { _ } from 'lodash';

const DEFAULT_SORT_METHOD = 'text';

export default function getAutoformSchema(models, record, field, options) {
  const { schema } = record;
  const { errors = {}, overrides = {} } = options;
  const fieldSchema = { ...overrides[field], ...schema.getFieldSchema(field) };
  const label = (fieldSchema.label) ? fieldSchema.label : schema.getFieldLabel(field);
  let result = {
    type: _getAutoformType(schema, field, fieldSchema),
    name: _getAutoformFieldName(schema, field),
    label,
  };
  result.defaultValue = _getDefaultValue(fieldSchema, record);
  result.error = _getError(errors, field);
  result.options = _getOptions(models, fieldSchema);
  if (result.options && result.options.toArray) {
    result.options = result.options.toArray(); // if an immutable list is returned
  }
  result.placeholder = _getPlaceholder(fieldSchema);
  result.helpText = _getHelpText(fieldSchema);
  result.singleFile = _acceptsSingleFile(fieldSchema);
  result.sortBy = fieldSchema.sortBy ? fieldSchema.sortBy : DEFAULT_SORT_METHOD;
  result = { ...fieldSchema, ...result };
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
    return SchemaParser.getMostNestedFieldName(field);
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

function _getOptions(models, fieldSchema) {
  if (_hasPredefinedOptions(fieldSchema)) {
    return _predefinedOptions(fieldSchema);
  } if (_hasEnum(fieldSchema)) {
    return _generateEnumOptions(fieldSchema);
  } if (_hasExternalServiceOptions(fieldSchema)) {
    return _externalServiceOptions(models, fieldSchema);
  }
  return null;
}

function _hasEnum(fieldSchema) {
  return fieldSchema.enumOptions != null;
}

function _generateEnumOptions(fieldSchema) {
  return List(Object.keys(fieldSchema.enumOptions).map(t => ({ key: t, value: t, text: fieldSchema.enumOptions[t] })));
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

function _externalServiceOptions(models, fieldSchema) {
  const service = fieldSchema.serviceDependency;
  return (service) ? _toDropDownOptions(models, service, fieldSchema.serviceFilter) : null;
}

function _getPlaceholder(fieldSchema) {
  return (fieldSchema.placeholder) ? fieldSchema.placeholder : null;
}

function _getError(errors, field) {
  return (errors[field]) ? errors[field] : null;
}

function _getHelpText(fieldSchema) {
  return (fieldSchema.helpText) ? fieldSchema.helpText : null;
}

function _toDropDownOptions(models, serviceKey, filter = {}) {
  if (Array.isArray(serviceKey)) {
    const options = serviceKey.reduce((res, key) => res.concat(_toDropDownOptions(models, key, filter)), new List());
    return options;
  }
  const formattedKey = serviceKey.charAt(0).toUpperCase() + serviceKey.slice(1).toLowerCase();
  return models[formattedKey].find(filter).map(p => ({ key: p._id, value: p._id, text: p.displayName }));
}
