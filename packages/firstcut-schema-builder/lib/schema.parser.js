"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ARRAY_INDICATOR = '$';
var FIELD_NAME_DELINEATOR = '.';
var ARRAY_INDEX_REGEX = /[0-9]+/;
var SchemaParser = Object.freeze({
  getFieldSchema: function getFieldSchema(schema, fieldname) {
    return _getFieldSchema(fieldname);
  },
  getFieldLabel: function getFieldLabel(schema, fieldname) {
    return schema.label(fieldname);
  },
  getFileStoreName: function getFileStoreName(schema, fieldname) {
    return _getFieldSchema(schema, fieldname).store;
  },
  getFieldCustomType: function getFieldCustomType(schema, fieldname) {
    return _getFieldSchema(schema, fieldname).customType;
  },
  hasNestedFields: function hasNestedFields(key) {
    return _hasNestedFields(key);
  },
  parseNestedFields: function parseNestedFields(key) {
    var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return _parseNestedFields(key, fields);
  },
  getMostNestedFieldName: function getMostNestedFieldName(field) {
    var nested_fields = _parseNestedFields(field);

    var last = nested_fields.length - 1;
    var most_nested = nested_fields[last];
    return most_nested;
  },
  getLeastNestedFieldName: function getLeastNestedFieldName(field) {
    var nested_fields = _parseNestedFields(field);

    return nested_fields[0];
  },
  isObjectArrayField: function isObjectArrayField(key) {
    return _arrayIndicatorIndex(key) != -1;
  },
  buildObjectField: function buildObjectField(field, subfield) {
    return _fieldAsObjectKey(field) + subfield;
  },
  buildObjectArrayField: function buildObjectArrayField(field, subfield) {
    return _buildObjectArrayField(field, subfield);
  },
  fieldAsObjectArrayKey: function fieldAsObjectArrayKey(field) {
    return _fieldAsObjectArrayKey(field);
  },
  fieldAsIndexedObjectArrayKey: function fieldAsIndexedObjectArrayKey(field, index) {
    return _fieldAsIndexedObjectArrayKey(field, index);
  },
  applyIndexToObjectArrayField: function applyIndexToObjectArrayField(field, index) {
    return _applyIndexToObjectArrayField(field, index);
  },
  fieldAsObjectKey: function fieldAsObjectKey(field) {
    return _fieldAsObjectKey(field);
  },
  unindexObjectArrayField: function unindexObjectArrayField(field) {
    return _unindexObjectArrayField(field);
  },
  buildIndexedObjectArrayField: function buildIndexedObjectArrayField(field, index, subfield) {
    return _buildIndexedObjectArrayField(field, index, subfield);
  },
  getIndexInObjectArrayField: function getIndexInObjectArrayField(field, index, subfield) {
    return _getIndexInObjectArrayField(field);
  }
});

function _getIndexInObjectArrayField(field) {
  return field.match(ARRAY_INDEX_REGEX);
}

function _unindexObjectArrayField(field) {
  var parsed = _parseNestedFields(field);

  if (parsed.length != 3) {
    return field;
  } else {
    return field.replace(ARRAY_INDEX_REGEX, ARRAY_INDICATOR);
  }
}

function _buildIndexedObjectArrayField(field, index, subfield) {
  var key = _buildObjectArrayField(field, subfield);

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

function _fieldAsIndexedObjectArrayKey(field, index) {
  field = _fieldAsObjectArrayKey(field);
  return _applyIndexToObjectArrayField(field, index);
}

function _parseNestedFields(key) {
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!_hasNestedFields(key)) {
    fields.push(key);
    return fields;
  }

  var _splitFieldName2 = _splitFieldName(key),
      parent = _splitFieldName2.parent,
      child = _splitFieldName2.child;

  fields.push(parent);
  return _parseNestedFields(child, fields);
}

function _getFieldSchema(schema, fieldname) {
  return schema.schema(fieldname);
}

function _isNestedObjectField(key) {
  return _subfieldIndicatorIndex(key) != -1;
}

function _splitFieldName(field) {
  var delineator = _subfieldIndicatorIndex(field);

  var parent = field.slice(0, delineator);
  var child = field.slice(delineator + 1);
  return {
    parent: parent,
    child: child
  };
}

function _subfieldIndicatorIndex(key) {
  return key.indexOf(FIELD_NAME_DELINEATOR);
}

function _arrayIndicatorIndex(key) {
  return key.indexOf(ARRAY_INDICATOR);
}

var _default = SchemaParser;
exports.default = _default;