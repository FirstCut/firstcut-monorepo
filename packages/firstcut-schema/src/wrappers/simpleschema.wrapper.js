import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';
import SchemaParser from '../parser';

SimpleSchema.extendOptions([
  'helpText',
  'sortBy',
  'options',
  'placeholder',
  'hidden',
  'customType',
  'rows',
  'store',
  'bucket',
  'serviceFilter',
  'enumOptions',
  'unique',
  'restricted',
  'customAutoValue',
  'serviceDependency',
]);

export default class SimpleSchemaWrapper {
  static fromSubSchema(schema, f) {
    let field = f;
    const quickType = schema.getQuickTypeForKey(field);
    if (quickType === 'object') {
      field = SchemaParser.fieldAsObjectKey(field);
    } else if (quickType === 'objectArray') {
      field = SchemaParser.fieldAsObjectArrayKey(field);
    }
    const nestedFields = schema.getObjectKeys(field);
    const result = {};
    nestedFields.forEach((subfield) => {
      const nestedKey = field + subfield;
      result[subfield] = schema.getFieldSchema(nestedKey);
    });
    return new SimpleSchemaWrapper(result);
  }

  static fromFields(schema, fields) {
    const subschema = fields.reduce((r, field) => {
      const result = r;
      result[field] = schema.getFieldSchema(field);
      return result;
    }, {});
    return new SimpleSchemaWrapper(subschema);
  }

  constructor(props) {
    this.asJson = { ...props };
    this.errorMessages = {};
  }

  publicFieldsOnly() {
    return new this.constructor(this.asJson, { restrict_fields: true });
  }

  extend(schema) {
    this.asJson = _.merge(this.asJson, schema);
  }

  fieldIsInSchema(key) {
    const field = SchemaParser.getLeastNestedFieldName(key);
    return this.asJson[field] != null;
  }

  getPublicFields() {
    const isPublic = key => this.asJson[key] && this.asJson[key].public === true;
    const getKey = key => key;
    return findFieldsSatisfyingCondition(Object.keys(this.asJson), isPublic, getKey);
  }

  getFileSchemaKeys() {
    const isFileSchemaKey = key => this.asJson[key] && this.asJson[key].customType === 'file';
    const getKey = key => key;
    return findFieldsSatisfyingCondition(Object.keys(this.asJson), isFileSchemaKey, getKey);
  }

  getRelatedRecordSchemaKeys({ models }) {
    let modelNames = models.map(model => [model.legacyModelName, model.modelName]);
    modelNames = _.flatten(modelNames);
    const serviceDependencyInModels = key => this.asJson[key] && modelNames.includes(this.asJson[key].serviceDependency);
    const getKey = key => key;
    return findFieldsSatisfyingCondition(Object.keys(this.asJson), serviceDependencyInModels, getKey);
  }

  get customAutovalueFields() {
    if (!this._customAutovalueFields) {
      this._customAutovalueFields = this._findCustomAutovalueFields();
    }
    return this._customAutovalueFields;
  }

  get uniqueFields() {
    if (!this._uniqueFields) {
      this._uniqueFields = this._findUniqueFields();
    }
    return this._uniqueFields;
  }

  get publicFields() {
    if (!this._publicFields) {
      this._publicFields = this._findPublicFields();
    }
    return this._publicFields;
  }

  get subobjectArrayKeys() {
    if (!this._subobjectArrayKeys) {
      this._subobjectArrayKeys = this._findSubobjectArrayFields();
    }
    return this._subobjectArrayKeys;
  }

  get asSchema() {
    if (!this._asSchema) {
      this._asSchema = this._getAsSchema();
    }
    return this._asSchema;
  }

  get subobjectKeys() {
    if (!this._subobjectKeys) {
      this._subobjectKeys = this._findSubobjectFields();
    }
    return this._subobjectKeys;
  }

  _getAsSchema() {
    const schema = new SimpleSchema(this.asJson, { requiredByDefault: false });
    schema.messageBox.messages(this.errorMessages);
    return schema;
  }

  _findSubobjectFields() {
    const condition = this.isSubobjectField.bind(this);
    const getKey = SchemaParser.fieldAsObjectKey;
    return this.findObjectKeysSatisfyingCondition(condition, getKey);
  }

  _findUniqueFields() {
    const condition = this.isUniqueField.bind(this);
    const getKey = key => key;
    return this.findObjectKeysSatisfyingCondition(condition, getKey);
  }

  _findPublicFields() {
    const condition = this.isPublicField.bind(this);
    const getKey = key => key;
    return this.findObjectKeysSatisfyingCondition(condition, getKey);
  }

  _findCustomAutovalueFields() {
    const condition = this.isCustomAutovalueField.bind(this);
    const getKey = key => key;
    return this.findObjectKeysSatisfyingCondition(condition, getKey);
  }

  _findSubobjectArrayFields() {
    const condition = this.isSubobjectArrayField.bind(this);
    const getKey = SchemaParser.fieldAsObjectArrayKey;
    return this.findObjectKeysSatisfyingCondition(condition, getKey);
  }

  findObjectKeysSatisfyingCondition(getCondition, getKey) {
    return findFieldsSatisfyingCondition(this.objectKeys(), getCondition, getKey);
  }

  getFieldLabel(field) {
    return this.asSchema.label(field);
  }

  getFieldSchema(f) {
    let field = f;
    if (SchemaParser.hasNestedFields(field)) {
      field = SchemaParser.unindexObjectArrayField(field);
    }
    return _.get(this.asJson, field);
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
    return this.getQuickTypeForKey(field) === 'objectArray';
  }

  isCustomAutovalueField(field) {
    return this.asJson[field].customAutoValue != null;
  }

  isPublicField(field) {
    return !(this.asJson[field].restricted);
  }

  isUniqueField(field) {
    return this.asJson[field].unique === true;
  }

  objectKeys() {
    return this.asSchema.objectKeys();
  }

  allFields() {
    return this.asSchema._schemaKeys;
  }

  isSubobjectField(f) {
    return this.getQuickTypeForKey(f) === 'object';
  }

  getQuickTypeForKey(field) {
    let quickType = this.asSchema.getQuickTypeForKey(field);
    if (!quickType) {
      const def = this.asSchema.getObjectSchema(field).getDefinition();
      if (Object.getOwnPropertyNames(def).length > 0) quickType = 'object';
    }
    return quickType;
  }

  validate(args) {
    return this.asSchema.validate(args);
  }

  validator() {
    return this.asSchema.validator();
  }

  clean(record) {
    if (record.toJS) {
      record = record.toJS();
    }
    return this.asSchema.clean(record, {
      autoConvert: true,
      removeNullsFromArrays: true,
      removeEmptyStrings: true,
      trimStrings: true,
      getAutoValues: true,
    });
  }

  addErrorMessages(msgs) {
    this.errorMessages = {
      ...this.errorMessages,
      msgs,
    };
  }
}

// good idea but unclear concept -- rework slightly or comment
function findFieldsSatisfyingCondition(keys, getCondition, getKey) {
  const fields = [];
  keys.forEach((field) => { // TODO: use filter
    if (getCondition(field)) {
      // const objKey = getKey(field); // need to review why this wasn't working again
      fields.push(field);
    }
  });
  return fields;
}
