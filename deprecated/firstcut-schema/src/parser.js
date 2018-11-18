
export const ARRAY_INDICATOR = '$';
export const FIELD_NAME_DELINEATOR = '.';
const ARRAY_INDEX_REGEX = /[0-9]+/;

const SchemaParser = Object.freeze({
  getFieldSchema(schema, fieldname) {
    return _getFieldSchema(fieldname);
  },

  getFieldLabel(schema, fieldname) {
    return schema.label(fieldname);
  },

  getFileStoreName(schema, fieldname) {
    return _getFieldSchema(schema, fieldname).store;
  },

  getFieldCustomType(schema, fieldname) {
    return _getFieldSchema(schema, fieldname).customType;
  },

  hasNestedFields(key) {
    return _hasNestedFields(key);
  },

  parseNestedFields(key, fields = []) {
    return _parseNestedFields(key, fields);
  },

  getMostNestedFieldName(field) {
    const nested_fields = _parseNestedFields(field);
    const last = nested_fields.length - 1;
    const most_nested = nested_fields[last];
    return most_nested;
  },

  getLeastNestedFieldName(field) {
    const nested_fields = _parseNestedFields(field);
    return nested_fields[0];
  },

  isObjectArrayField(key) {
    return _arrayIndicatorIndex(key) !== -1;
  },

  buildObjectField(field, subfield) {
    return _fieldAsObjectKey(field) + subfield;
  },

  buildObjectArrayField(field, subfield) {
    return _buildObjectArrayField(field, subfield);
  },

  fieldAsObjectArrayKey(field) {
    return _fieldAsObjectArrayKey(field);
  },

  fieldAsIndexedObjectArrayKey(field, index) {
    return _fieldAsIndexedObjectArrayKey(field, index);
  },

  applyIndexToObjectArrayField(field, index) {
    return _applyIndexToObjectArrayField(field, index);
  },

  fieldAsObjectKey(field) {
    return _fieldAsObjectKey(field);
  },

  unindexObjectArrayField(field) {
    return _unindexObjectArrayField(field);
  },

  buildIndexedObjectArrayField(field, index, subfield) {
    return _buildIndexedObjectArrayField(field, index, subfield);
  },

  getIndexInObjectArrayField(field) {
    return _getIndexInObjectArrayField(field);
  },
});

function _getIndexInObjectArrayField(field) {
  return field.match(ARRAY_INDEX_REGEX);
}

function _unindexObjectArrayField(field) {
  const parsed = _parseNestedFields(field);
  if (parsed.length !== 3) {
    return field;
  }
  return field.replace(ARRAY_INDEX_REGEX, ARRAY_INDICATOR);
}

function _buildIndexedObjectArrayField(field, index, subfield) {
  const key = _buildObjectArrayField(field, subfield);
  return _applyIndexToObjectArrayField(key, index);
}

function _buildObjectArrayField(field, subfield) {
  return _fieldAsObjectArrayKey(field) + subfield;
}

function _applyIndexToObjectArrayField(field, index) {
  return field.replace(ARRAY_INDICATOR, index);
}

function _hasNestedFields(key) {
  return _isNestedObjectField(key);
}

function _fieldAsObjectKey(field) {
  return field + FIELD_NAME_DELINEATOR;
}

function _fieldAsObjectArrayKey(field) {
  return field + FIELD_NAME_DELINEATOR + ARRAY_INDICATOR + FIELD_NAME_DELINEATOR;
}

function _fieldAsIndexedObjectArrayKey(f, index) {
  let field = f;
  field = _fieldAsObjectArrayKey(field);
  return _applyIndexToObjectArrayField(field, index);
}

function _parseNestedFields(key, fields = []) {
  if (!_hasNestedFields(key)) {
    fields.push(key);
    return fields;
  }
  const { parent, child } = _splitFieldName(key);
  fields.push(parent);
  return _parseNestedFields(child, fields);
}

function _getFieldSchema(schema, fieldname) {
  return schema.schema(fieldname);
}

function _isNestedObjectField(key) {
  return _subfieldIndicatorIndex(key) !== -1;
}

function _splitFieldName(field) {
  const delineator = _subfieldIndicatorIndex(field);
  const parent = field.slice(0, delineator);
  const child = field.slice(delineator + 1);
  return { parent, child };
}

function _subfieldIndicatorIndex(key) {
  return key.indexOf(FIELD_NAME_DELINEATOR);
}

function _arrayIndicatorIndex(key) {
  return key.indexOf(ARRAY_INDICATOR);
}

export default SchemaParser;
