
import { SchemaParser } from 'firstcut-schema';
import { Record, List } from 'immutable';
import { _ } from 'lodash';
import { isEmpty } from 'firstcut-utils';
import { eventsInHistory } from 'firstcut-action-utils';
import { PubSub } from 'pubsub-js';
import RecordWithSchemaFactory from './utils/factories';

import generateImmutableDefaults from './utils/generate-defaults';

const DEFAULT_COUNTRY = 'United States';

function createBaseModel(schema) {
  return BaseModel(generateImmutableDefaults(schema));
}

export const BaseModel = defaultValues => class extends Record({
  ...defaultValues,
}) {
  constructor(properties) {
    super({ ...properties });
  }

  static createNew(properties) {
    return new this(properties);
  }

  static fromId(id) {
    if (!id) {
      return null;
    }
    return this.find({ _id: id }).get(0);
  }

  static findOne(query = {}) {
    return this.find(query).get(0);
  }

  static find(q = {}) {
    const { query, notInSchemaQuery } = cleanQuery(q, this.schema);
    let docs = this.collection.find(query).fetch();
    if (!docs) {
      return new List([]);
    }
    docs = List(docs.map(d => new this(d)));
    if (!isEmpty(notInSchemaQuery)) {
      docs = docs.filter((doc) => {
        let fitsAllQueries = true;
        _.forEach(notInSchemaQuery, (v, key) => {
          const value = v;
          let fitsQuery = false;
          if (typeof value === 'function') {
            fitsQuery = value(doc[key]);
          } else if (typeof doc[key] === 'function') {
            fitsQuery = (doc[key]() === value);
          } else if (doc[key] !== value) {
            fitsQuery = false;
          }
          fitsAllQueries = fitsQuery && fitsAllQueries;
        });
        return fitsAllQueries;
      });
    }
    return docs;
  }

  static count(query = {}) {
    return this.find(query).count();
  }

  static getFieldLabel(field) {
    return this.schema.getFieldLabel(field);
  }

  static validate(record) {
    const { uniqueFields } = this.schema;
    uniqueFields.forEach((field) => {
      if (record[field]) {
        if (this.findOne({ _id: { $ne: record._id }, [field]: record[field] })) {
          throw new ValidationError([{
            name: field,
            type: 'value must be unique',
            message: `A record with ${field} ${record[field]} already exists`,
          }]);
        }
      }
    });
    this.schema.validate(record);
  }

  static validator() { this.schema.validator(); }

  createNew(properties) {
    return this.constructor.createNew(properties);
  }

  /* TODO: hide this better */
  static get collection() {
    let collection = this._collection;
    if (!collection) {
      try {
        collection = new Mongo.Collection(this.collectionName);
        collection.attachSchema(this.schema.asSchema);
        this._collection = collection;
      } catch (e) {
        PubSub.publish('error', e);
      }
    }
    return collection;
  }

  static set models(models) {
    this._models = models;
  }

  static get models() {
    return this._models;
  }

  static get legacyModelName() {
    return this.modelName.toUpperCase();
  }

  static get basepath() {
    return `/${this.collectionName}`;
  }

  static get schema() {
    return this._schema;
  }

  static set schema(schema) {
    this._schema = schema;
  }

  static get availableBlueprints() {
    return this._blueprints;
  }

  static set availableBlueprints(blueprints) {
    this._blueprints = blueprints;
    this.schema.setBlueprintOptions(blueprints);
  }

  static getFileSchemaKeys() {
    return this.schema.getFileSchemaKeys();
  }

  static getRelatedRecordSchemaKeys({ models }) {
    return this.schema.getRelatedRecordSchemaKeys({ models });
  }

  static getSubobjectKeys() {
    return this.schema.subobjectKeys;
  }

  static getSubobjectArrayKeys() {
    return this.schema.subobjectArrayKeys;
  }

  isOfType(model) {
    return model.modelName === this.modelName;
  }

  newSubrecordFromKey(key, properties) {
    const objSchema = this.schema.constructor.fromSubSchema(this.schema, key);
    const SubobjRecord = RecordWithSchemaFactory(Record, objSchema);
    return new SubobjRecord(properties);
  }

  addSubobjectToSubarray(field, properties) {
    const obj = this.newSubrecordFromKey(field, properties);
    const newArr = this[field].push(obj);
    return this.set(field, newArr);
  }

  removeSubobjectFromSubarray(field, index) {
    const newArr = this[field].remove(index);
    return this.set(field, newArr);
  }

  nestedStructuresToImmutables() {
    const self = this.initializeSubobjects();
    return self.initializeSubobjectArrays();
  }

  initializeSubobjects() {
    const fields = this.getSubobjectKeys();
    let self = this;
    fields.forEach((f) => {
      const subobject = this.get(f);
      const subrecord = this.newSubrecordFromKey(f, subobject);
      self = self.set(f, subrecord);
    });
    return self;
  }

  initializeSubobjectArrays() {
    const fields = this.getSubobjectArrayKeys();
    let self = this;
    fields.forEach((f) => {
      const objects = self.get(f);
      self = self.set(f, new List([]));
      self = objects.reduce((result, o) => {
        let r = result;
        r = r.addSubobjectToSubarray(f, o);
        return r;
      }, self);
    });
    return self;
  }

  get model() {
    return this.constructor;
  }

  get country() {
    return (this.location)
      ? this.location.country
      : DEFAULT_COUNTRY;
  }

  getSubobjectKeys() {
    return this.constructor.getSubobjectKeys();
  }

  getSubobjectArrayKeys() {
    return this.constructor.getSubobjectArrayKeys();
  }

  get schema() {
    return this.constructor.schema;
  }

  get models() {
    return this.constructor.models;
  }

  get hasBeenSaved() {
    return this.constructor.collection.findOne(this._id) != null;
  }

  get blueprintLabel() {
    return (this.blueprint)
      ? this.constructor.availableBlueprints[this.blueprint].label
      : '';
  }

  get modelName() {
    return this.constructor.modelName;
  }

  get legacyModelName() {
    return this.constructor.legacyModelName;
  }

  get availableBlueprints() {
    return this.constructor.availableBlueprints;
  }

  get eventsInHistory() {
    return eventsInHistory(this.history);
  }

  get publicFields() {
    return this.schema.getPublicFields();
  }

  get invoices() {
    const type = this.legacyModelName;
    const gigId = this._id;
    return this.invoiceService.find({ gigId, type });
  }

  get clientService() {
    return this.getServiceOfType('Client');
  }

  get collaboratorService() {
    return this.getServiceOfType('Collaborator');
  }

  get companyService() {
    return this.getServiceOfType('Company');
  }

  get projectService() {
    return this.getServiceOfType('Project');
  }

  get shootService() {
    return this.getServiceOfType('Shoot');
  }

  get deliverableService() {
    return this.getServiceOfType('Deliverable');
  }

  get cutService() {
    return this.getServiceOfType('Cut');
  }

  get invoiceService() {
    return this.getServiceOfType('Invoice');
  }

  get taskService() {
    return this.getServiceOfType('Task');
  }

  getServiceOfType(modelName) {
    return this.models[modelName];
  }

  keyIsOfTypeArray(key) {
    const parentKey = SchemaParser.getLeastNestedFieldName(key);
    return Array.isArray(super.get(parentKey));
  }

  keyIsOfTypePlainObject(key) {
    const parentKey = SchemaParser.getLeastNestedFieldName(key);
    const value = super.get(parentKey);
    return !(value instanceof Record) && value instanceof Object;
  }

  getValueOfNestedArrayField(key) {
    const parentKey = SchemaParser.getLeastNestedFieldName(key);
    const childKey = SchemaParser.getMostNestedFieldName(key);
    const index = SchemaParser.getIndexInObjectArrayField(key);
    if (childKey === index) {
      return super[parentKey][index];
    }
    return super[parentKey][index][childKey];
  }

  get(key) {
    if (SchemaParser.hasNestedFields(key)) {
      if (this.keyIsOfTypeArray(key)) {
        return this.getValueOfNestedArrayField(key);
      }
      const nestedFields = SchemaParser.parseNestedFields(key);
      return this.getIn(nestedFields);
    }
    return super.get(key);
  }

  set(key, value, setBlueprint = true) {
    if (key === 'blueprint' && setBlueprint && this.availableBlueprints) {
      const record = applyBlueprint(this, value);
      return record.set('blueprint', value, false);
    }
    if (SchemaParser.hasNestedFields(key)) {
      if (this.keyIsOfTypeArray(key)) {
        const index = SchemaParser.getIndexInObjectArrayField(key);
        const parentField = SchemaParser.getLeastNestedFieldName(key);
        const childField = SchemaParser.getMostNestedFieldName(key);
        const array = super[parentField];
        if (childField === index) {
          array[index] = value;
        } else {
          array[index][childField] = value;
        }
        return super.set(parentField, array);
      }
      const nestedFields = SchemaParser.parseNestedFields(key);
      return this.setIn(nestedFields, value);
    }
    return super.set(key, value);
  }

  validate() {
    return this.constructor.validate(this);
  }

  clean() {
    return this.constructor.persister.clean(this);
  }

  save() {
    const promise = this.constructor.persister.save(this);
    return promise;
  }

  remove() {
    return this.constructor.persister.remove(this);
  }

  getFieldLabel(field) {
    return this.constructor.getFieldLabel(field);
  }
};

function applyBlueprint(r, blueprint) {
  let record = r;
  if (!blueprint) {
    throw new Meteor.Error('malformed-params', 'Cannot apply blueprint when blueprint is undefined or null');
  }
  if (!record.availableBlueprints) {
    throw new Meteor.Error('malformed-params', 'Record does not have available blueprints assigned to it. Cannot apply blueprint');
  }
  if (!record.availableBlueprints[blueprint]) {
    throw new Meteor.Error('malformed-params', `Blueprint ${blueprint} not one of record's available blueprints`);
  }
  const { defaults } = record.availableBlueprints[blueprint];
  Object.keys(defaults).forEach((key) => {
    record = record.set(key, defaults[key]);
  });
  return record;
}

function cleanQuery(q, schema) {
  const defined = reduceToDefinedFields(q);
  const flattenedMap = flattenNestedFields(defined);
  const { query, notInSchemaQuery } = segmentIntoSchemaAndNotSchemaQueries(flattenedMap, schema);
  return { query, notInSchemaQuery };
}

function segmentIntoSchemaAndNotSchemaQueries(obj, schema) {
  const query = obj;
  const notInSchemaQuery = {};
  _.forEach(obj, (value, key) => {
    if (!schema.fieldIsInSchema(key)) {
      notInSchemaQuery[key] = value;
      delete query[key];
    }
  });
  return { query, notInSchemaQuery };
}

function reduceToDefinedFields(obj) {
  return reduceObj(obj, (accumulated, field) => {
    const result = accumulated;
    const value = obj[field];
    if (_.isPlainObject(value)) {
      const defined = reduceToDefinedFields(value);
      if (!_.isEmpty(defined)) {
        result[field] = defined;
      }
    } else if (value != null && value !== '' && !Array.isArray(value)) {
      result[field] = value;
    } else if (Array.isArray(value) && value.length !== 0) {
      result[field] = value;
    }
    return result;
  }, {});
}

function flattenNestedFields(m) {
  return reduceObj(m, (accumulated, field) => {
    const result = accumulated;
    const value = m[field];
    if (_.isPlainObject(value)) {
      _.forEach(_.keys(value), (subfield) => {
        if (!isMongoOperator(subfield) && typeof subfield !== 'function') { // e.g. {"contact": {"name": "value"}}
          const queryKey = SchemaParser.buildObjectField(field, subfield);
          result[queryKey] = value[subfield];
        } else {
          result[field] = value;
        }
      });
    } else {
      result[field] = value;
    }
    return result;
  }, {});
}

function isMongoOperator(str) {
  return str[0] === '$';
}

function reduceObj(obj, func, seed) {
  return _.reduce(_.keys(obj), func, seed);
}

export default createBaseModel;
