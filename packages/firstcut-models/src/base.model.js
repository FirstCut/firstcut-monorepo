import {SimpleSchemaWrapper, SchemaParser} from 'firstcut-schema-builder';
import {Record, List} from 'immutable';
import {ensureLoggedIn} from 'firstcut-utils';
import RecordWithSchemaFactory from './utils/factories.js';
import {_} from 'lodash';
import {getPlayer} from 'firstcut-utils';

const DEFAULT_COUNTRY = 'United States';

export const BaseModel = defaultValues => class extends Record({
  ...defaultValues
}) {

  static createNew(properties) {
    return new this(properties);
  }

  static fromId(id) {
    if (!id) {
      return null;
    }
    return this.find({_id: id}).get(0);
  }

  static findOne(query = {}) {
    return this.find(query).get(0);
  }

  static find(query = {}) {
    query = cleanQuery(query);
    const docs = this.collection.find(query).fetch();
    if (!docs) {
      return new List([]);
    }
    return List(docs.map(d => new this(d)));
  }

  static count(query = {}) {
    return this.find(query).count();
  }

  static getFieldLabel(field) {
    return this.schema.getFieldLabel(field);
  }

  createNew(properties) {
    return this.constructor.createNew(properties);
  }

  /* TODO: hide this better */
  static get collection() {
    if (!this._collection) {
      this._collection = new Mongo.Collection(this.collection_name);
      // this._collection.attachSchema(this.schema.asSchema);
    }
    return this._collection;
  }

  static set models(models) {
    this._models = models;
  }
  static get models() {
    return this._models;
  }
  static get legacy_model_name() {
    return this.model_name.toUpperCase();
  }
  static get model_name() {
    return this._model_name;
  }
  static set model_name(name) {
    this._model_name = name;
  }
  static get basepath() {
    return "/" + this.collection_name;
  }
  static get schema() {
    return this._schema;
  }
  static set schema(schema) {
    this._schema = schema;
  }
  static get available_blueprints() {
    return this._blueprints;
  }
  static set available_blueprints(blueprints) {
    this._blueprints = blueprints;
    this.schema.setBlueprintOptions(blueprints);
  }
  static getFileSchemaKeys() {
    return this.schema.getFileSchemaKeys();
  }
  static getRelatedRecordSchemaKeys({models}) {
    return this.schema.getRelatedRecordSchemaKeys({models});
  }
  static get _subobject_keys() {
    return this.schema.subobject_keys;
  };
  static get _subobjectarray_keys() {
    return this.schema.subobjectarray_keys;
  };

  isOfType(model) {
    return model.model_name == this.model_name;
  }

  newSubrecordFromKey(key, properties) {
    const object_schema = this.schema.constructor.fromSubSchema(this.schema, key);
    const subobject_record = RecordWithSchemaFactory(Record, object_schema);
    return new subobject_record(properties);
  }

  addSubobjectToSubarray(field, properties) {
    const obj = this.newSubrecordFromKey(field, properties);
    const new_arr = this[field].push(obj);
    return this.set(field, new_arr);
  }

  removeSubobjectFromSubarray(field, index) {
    const new_arr = this[field].remove(index);
    return this.set(field, new_arr);
  }

  nestedStructuresToImmutables() {
    let self = this.initializeSubobjects();
    return self.initializeSubobjectArrays();
  }

  constructor(properties, options={}) {
    super({...properties});
    // if (!options.prevent_initialization_of_nested_structures) {
    //   let self = this.initializeSubobjects();
    //   return self.initializeSubobjectArrays();
    // }
  }

  initializeSubobjects() {
    const fields = this._subobject_keys;
    let self = this;
    fields.forEach(f => {
      const subobject = this.get(f);
      const subrecord = this.newSubrecordFromKey(f, subobject);
      self = self.set(f, subrecord);
    });
    return self;
  }

  initializeSubobjectArrays() {
    const fields = this._subobjectarray_keys;
    let self = this;
    fields.forEach(f => {
      let objects = self.get(f);
      self = self.set(f, new List([]));
      objects.forEach(o => self = self.addSubobjectToSubarray(f, o));
    });
    return self;
  }

  get createdByRecord() {
    return getPlayer(this.models, this.createdBy);
  }
  get model() {
    return this.constructor;
  }
  get country() {
    return (this.location)
      ? this.location.country
      : DEFAULT_COUNTRY;
  }
  get _subobject_keys() {
    return this.constructor._subobject_keys;
  };
  get _subobjectarray_keys() {
    return this.constructor._subobjectarray_keys;
  };
  get schema() {
    return this.constructor.schema;
  }
  get models() {
    return this.constructor.models;
  }
  get has_been_saved() {
    return this.constructor.collection.findOne(this._id) != null;
  }
  get blueprintLabel() {
    return (this.blueprint)
      ? this.constructor.available_blueprints[this.blueprint].label
      : "";
  }
  get model_name() {
    return this.constructor.model_name;
  }
  set model_name(name) {
    this.constructor.model_name = name;
  }
  get legacy_model_name() {
    return this.constructor.legacy_model_name;
  }
  get available_blueprints() {
    return this.constructor.available_blueprints;
  }
  get eventsInHistory() {
    return this.history.map(event => event.event);
  }
  get public_fields() {
    return this.schema.getPublicFields();
  }
  get invoices() {
    const type = this.legacy_model_name;
    const gigId = this._id;
    return this.invoiceService.find({gigId, type});
  }

  get clientService() {
    return this.models.Client;
  }
  get collaboratorService() {
    return this.models.Collaborator;
  }
  get companyService() {
    return this.models.Company;
  }
  get projectService() {
    return this.models.Project;
  }
  get shootService() {
    return this.models.Shoot;
  }
  get deliverableService() {
    return this.models.Deliverable;
  }
  get cutService() {
    return this.models.Cut;
  }
  get invoiceService() {
    return this.models.Invoice;
  }

  keyIsOfTypeArray(key) {
    const parent_key = SchemaParser.getLeastNestedFieldName(key);
    return Array.isArray(super.get(parent_key));
  }

  keyIsOfTypePlainObject(key) {
    const parent_key = SchemaParser.getLeastNestedFieldName(key);
    const value = super.get(parent_key);
    return !(value instanceof Record) && value instanceof Object;
  }

  getValueOfNestedArrayField(key) {
    const parent_key = SchemaParser.getLeastNestedFieldName(key);
    const child_key = SchemaParser.getMostNestedFieldName(key);
    const index = SchemaParser.getIndexInObjectArrayField(key);
    if (child_key == index) {
      return super[parent_key][index];
    }
    return super[parent_key][index][child_key];
  }

  get(key) {
    if (SchemaParser.hasNestedFields(key)) {
      if (this.keyIsOfTypeArray(key)) {
        return this.getValueOfNestedArrayField(key);
      }
      const nested_fields = SchemaParser.parseNestedFields(key);
      return this.getIn(nested_fields);
    }
    return super.get(key);
  }

  set(key, value, apply_blueprint = true) {
    if (key == 'blueprint' && apply_blueprint && this.available_blueprints) {
      let record = applyBlueprint(this, value);
      return record.set('blueprint', value, false);
    } else {
      if (SchemaParser.hasNestedFields(key)) {
        if (this.keyIsOfTypeArray(key)) {
          const index = SchemaParser.getIndexInObjectArrayField(key);
          const parent_field = SchemaParser.getLeastNestedFieldName(key);
          const child_field = SchemaParser.getMostNestedFieldName(key);
          const array = super[parent_field];
          if (child_field == index) {
            array[index] = value;
          } else {
            array[index][child_field] = value;
          }
          return super.set(parent_field, array);
        }
        const nested_fields = SchemaParser.parseNestedFields(key);
        return this.setIn(nested_fields, value);
      }
      return super.set(key, value);
    }
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
}

function applyBlueprint(record, blueprint) {
  if (!blueprint) {
    throw new Meteor.Error('malformed-params', 'Cannot apply blueprint when blueprint is undefined or null');
  }
  if (!record.available_blueprints) {
    throw new Meteor.Error('malformed-params', 'Record does not have available blueprints assigned to it. Cannot apply blueprint');
  }
  if (!record.available_blueprints[blueprint]) {
    throw new Meteor.Error('malformed-params', `Blueprint ${blueprint} not one of record's available blueprints`);
  }
  const defaults = record.available_blueprints[blueprint].defaults;
  Object.keys(defaults).forEach(key => record = record.set(key, defaults[key]))
  return record;
}

function cleanQuery(q) {
  let defined = reduceToDefinedFields(q);
  let flattened_map = flattenNestedFields(defined);
  return flattened_map;
}

function reduceToDefinedFields(obj) {
  return reduceObj(obj, (result, field) => {
    let value = obj[field];
    if (_.isPlainObject(value)) {
      let defined = reduceToDefinedFields(value);
      if (!_.isEmpty(defined)) {
        result[field] = defined;
      }
    } else if (value != null && value !== '') {
      result[field] = value;
    }
    return result;
  }, {});
}

function flattenNestedFields(m) {
  return reduceObj(m, (result, field) => {
    let value = m[field];
    if (_.isObject(value)) {
      _.forEach(_.keys(value), (subfield) => {
        if (!isMongoOperator(subfield)) { //e.g. {"contact": {"name": "value}}
          let query_key = SchemaParser.buildObjectField(field, subfield);
          result[query_key] = value[subfield];
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
  return str[0] == '$';
}

function reduceObj(obj, func, seed) {
  return _.reduce(_.keys(obj), func, seed);
}
