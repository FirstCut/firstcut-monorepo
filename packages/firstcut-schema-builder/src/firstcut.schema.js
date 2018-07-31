import SimpleSchema from 'simpl-schema';
import SchemaParser from './schema.parser.js';
import {_} from 'lodash';

SimpleSchema.extendOptions([
  'helpText',
  'sortBy',
  'options',
  'placeholder',
  'hidden',
  'customType',
  'store',
  'serviceFilter',
  'enumOptions',
  'restricted',
  'unique',
  'serviceDependency'
]);

export default class FCSchema {
  static fromSubSchema(schema, field) {
    let quick_type_1 = schema.getQuickTypeForKey(field);
    if (quick_type_1 == 'object') {
      field = SchemaParser.fieldAsObjectKey(field);
    } else if (quick_type_1 == 'objectArray') {
      field = SchemaParser.fieldAsObjectArrayKey(field);
    }
    const result = {};
    let nested_fields = schema.getObjectKeys(field)
    nested_fields.forEach(subfield => {
      let nested_key = field + subfield;
      result[subfield] = schema.getFieldSchema(nested_key);
    });
    return new this(result);
  }

  static fromFields(schema, fields) {
    let subschema = {};
    fields.forEach(field => {
      subschema[field] = schema.getFieldSchema(field);
    });
    return new SimpleSchemaWrapper(subschema);
  }

  constructor(props, options={}) {
    // if (options.restrict_fields) {
    //   props = _.reduce(props, (result, value, key) => {
    //     const parent_key = SchemaParser.getLeastNestedFieldName(key);
    //     if (!value.restricted && !props[parent_key].restricted) {
    //       result[key] = value;
    //     }
    //     return result;
    //   }, {});
    // }
    this.as_json = {...props};
    this.error_messages = {};
    this._precalculateProperties();
  }

  publicFieldsOnly() {
    return new this.constructor(this.as_json, {restrict_fields: true});
  }

  extend(schema) {
    this.as_json = _.merge(this.as_json, schema);
    this._precalculateProperties();
  }

  getPublicFields() {
    const isPublic = (key) => this.as_json[key] && this.as_json[key].public == true
    const getKey = (key) => key
    return this.findFieldsSatisfyingCondition(Object.keys(this.as_json), isFileSchemaKey, getKey);
  }

  getFileSchemaKeys() {
    const isFileSchemaKey = (key) => this.as_json[key] && this.as_json[key].customType == 'file'
    const getKey = (key) => key;
    return this.findFieldsSatisfyingCondition(Object.keys(this.as_json), isFileSchemaKey, getKey);
  }

  getRelatedRecordSchemaKeys({models}) {
    let model_names = models.map(model => [model.legacy_model_name, model.model_name]);
    model_names = _.flatten(model_names);
    const serviceDependencyInModels = (key) => {
      return this.as_json[key] && model_names.includes(this.as_json[key].serviceDependency)
    }
    const getKey = (key) => key;
    return this.findFieldsSatisfyingCondition(Object.keys(this.as_json), serviceDependencyInModels, getKey);
  }

  _precalculateProperties() {
    this.asSchema = this._getAsSchema();
    this.subobject_keys = this._findSubobjectFields();
    this.subobjectarray_keys = this._findSubobjectArrayFields();
    this.public_fields = this._findPublicFields();
    this.unique_fields = this._findUniqueFields();
  }

  _getAsSchema() {
    const schema = new SimpleSchema(this.as_json, {requiredByDefault: false});
    schema.messageBox.messages(this.error_messages);
    return schema;
  }

  _findSubobjectFields() {
    const condition = this.isSubobjectField.bind(this);
    const get_key = SchemaParser.fieldAsObjectKey;
    return this.findObjectKeysSatisfyingCondition(condition, get_key);
  }

  _findUniqueFields() {
    const condition = this.isUniqueField.bind(this);
    const get_key = (key) => key;
    return this.findObjectKeysSatisfyingCondition(condition, get_key);
  }

  _findPublicFields() {
    const condition = this.isPublicField.bind(this);
    const get_key = (key) => key;
    return this.findObjectKeysSatisfyingCondition(condition, get_key);
  }

  _findSubobjectArrayFields() {
    const condition = this.isSubobjectArrayField.bind(this);
    const get_key = SchemaParser.fieldAsObjectArrayKey;
    return this.findObjectKeysSatisfyingCondition(condition, get_key);
  }

  findObjectKeysSatisfyingCondition(getCondition, getKey) {
    return this.findFieldsSatisfyingCondition(this.objectKeys(), getCondition, getKey);
  };

  //good idea but unclear concept -- rework slightly or comment
  findFieldsSatisfyingCondition(keys, getCondition, getKey) {
    const fields = [];
    keys.forEach(field => { //TODO: use filter
      if (getCondition(field)) {
        const obj_key = getKey(field);
        fields.push(field);
      }
    });
    return fields;
  }

  getFieldLabel(field) {
    return this.asSchema.label(field);
  }

  getFieldSchema(field) {
    if (SchemaParser.hasNestedFields(field)) {
      field = SchemaParser.unindexObjectArrayField(field);
    }
    return _.get(this.as_json, field);
  }

  getObjectKeys(field) {
    return this.asSchema._objectKeys[field] || [];
  }

  getNestedKeysForObjectArray(field) {
    const key = SchemaParser.fieldAsObjectArrayKey(field);
    return this.getObjectKeys(key);
  }

  getKeysForObjectArray(field) {
    return this.getNestedKeysForObjectArray(field).map(k => SchemaParser.buildObjectArrayField(field, k));
  }

  isSubobjectArrayField(field) {
    return this.getQuickTypeForKey(field) == 'objectArray';
  }

  isPublicField(field) {
    return !(this.as_json[field].restricted);
  }

  isUniqueField(field) {
    return this.as_json[field].unique === true;
  }

  objectKeys() {
    return this.asSchema.objectKeys();
  }

  isSubobjectField(f) {
    return this.getQuickTypeForKey(f) == 'object';
  }

  getQuickTypeForKey(field) {
    let quick_type = this.asSchema.getQuickTypeForKey(field);
    if (!quick_type) {
      let def = this.asSchema.getObjectSchema(field).getDefinition();
      if (Object.getOwnPropertyNames(def).length > 0)
        quick_type = 'object';
      }
    return quick_type;
  }

  validate(args) {
    return this.asSchema.validate(args);
  }

  validator() {
    return this.asSchema.validator();
  }

  clean(record) {
    return this.asSchema.clean(record, {
      autoConvert: true,
      removeNullsFromArrays: true,
      removeEmptyStrings: true,
      trimStrings: true,
      getAutoValues: true
    });
  }

  addErrorMessages(msgs) {
    this.error_messages = {
      ...this.error_messages,
      msgs
    };
  }

}
