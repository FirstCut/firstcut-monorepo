
import { BaseModel, Models } from 'firstcut-models';
import { List, Record } from 'immutable';
import { SchemaParser, SimpleSchemaWrapper } from 'firstcut-schema-builder';

const DEFAULT_SORT_METHOD = 'text';

export default function getAutoformSchema(schema, field, options) {
  const {errors={}, overrides={}} = options;
  let field_schema = {...overrides[field], ...schema.getFieldSchema(field)};
  let result = {
    type: _getAutoformType(schema, field, field_schema),
    name: _getAutoformFieldName(schema, field),
    label: schema.getFieldLabel(field),
  }
  result.error = _getError(errors, field);
  result.options = _getOptions(field_schema);
  result.placeholder = _getPlaceholder(field_schema);
  result.help_text = _getHelpText(field_schema);
  result.single_file = _acceptsSingleFile(field_schema);
  result.sortBy = field_schema.sortBy ? field_schema.sortBy : DEFAULT_SORT_METHOD;
  result = {...field_schema, ...result};
  // if (field_schema.defaultValue) {
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
    return SchemaParser.getMostNestedFieldName(field);
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
	return List(Object.keys(field_schema.enumOptions).map((t)=> {
		return {key: t, value: t, text: field_schema.enumOptions[t]};
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
  const service = field_schema.serviceDependency;
  return (service)? _toDropDownOptions(service, field_schema.serviceFilter) : null;
}

function _getPlaceholder(field_schema) {
  return (field_schema.placeholder)? field_schema.placeholder : null;
}

function _getError(errors, field) {
  return (errors[field])? errors[field] : null;
}

function _getHelpText(field_schema) {
  return (field_schema.helpText)? field_schema.helpText : null;
}

function _applyExtras(result, field, overrides) {
  const field_extras = overrides[field];
  if(field_extras) {
    Object.keys(field_extras).forEach(e => {result[e] = field_extras[e]});
  }
  return result;
}

function _toDropDownOptions(service_key, filter={}) {
	return Models[service_key].find(filter).map((p) =>{
		return { key: p._id, value: p._id, text: p.displayName};
	});
}
