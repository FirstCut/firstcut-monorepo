"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BaseModel = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _meteor = require("meteor/meteor");

var _firstcutSchema = require("firstcut-schema");

var _immutable = require("immutable");

var _lodash = require("lodash");

var _firstcutUtils = require("firstcut-utils");

var _firstcutActionUtils = require("firstcut-action-utils");

var _firstcutPlayers = require("firstcut-players");

var _pubsubJs = require("pubsub-js");

var _factories = _interopRequireDefault(require("./utils/factories"));

var _generateDefaults = _interopRequireDefault(require("./utils/generate-defaults"));

var DEFAULT_COUNTRY = 'United States';

function createBaseModel(schema) {
  return BaseModel((0, _generateDefaults.default)(schema));
}

var BaseModel = function BaseModel(defaultValues) {
  return (
    /*#__PURE__*/
    function (_Record) {
      (0, _inherits2.default)(_class, _Record);

      function _class(properties) {
        (0, _classCallCheck2.default)(this, _class);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).call(this, (0, _objectSpread2.default)({}, properties)));
      }

      (0, _createClass2.default)(_class, [{
        key: "createNew",
        value: function createNew(properties) {
          return this.constructor.createNew(properties);
        }
        /* TODO: hide this better */

      }, {
        key: "isOfType",
        value: function isOfType(model) {
          return model.modelName === this.modelName;
        }
      }, {
        key: "newSubrecordFromKey",
        value: function newSubrecordFromKey(key, properties) {
          var objSchema = this.schema.constructor.fromSubSchema(this.schema, key);
          var SubobjRecord = (0, _factories.default)(_immutable.Record, objSchema);
          return new SubobjRecord(properties);
        }
      }, {
        key: "addSubobjectToSubarray",
        value: function addSubobjectToSubarray(field, properties) {
          var obj = this.newSubrecordFromKey(field, properties);
          var newArr = this[field].push(obj);
          return this.set(field, newArr);
        }
      }, {
        key: "removeSubobjectFromSubarray",
        value: function removeSubobjectFromSubarray(field, index) {
          var newArr = this[field].remove(index);
          return this.set(field, newArr);
        }
      }, {
        key: "nestedStructuresToImmutables",
        value: function nestedStructuresToImmutables() {
          var self = this.initializeSubobjects();
          return self.initializeSubobjectArrays();
        }
      }, {
        key: "initializeSubobjects",
        value: function initializeSubobjects() {
          var _this = this;

          var fields = this.getSubobjectKeys();
          var self = this;
          fields.forEach(function (f) {
            var subobject = _this.get(f);

            var subrecord = _this.newSubrecordFromKey(f, subobject);

            self = self.set(f, subrecord);
          });
          return self;
        }
      }, {
        key: "initializeSubobjectArrays",
        value: function initializeSubobjectArrays() {
          var fields = this.getSubobjectArrayKeys();
          var self = this;
          fields.forEach(function (f) {
            var objects = self.get(f);
            self = self.set(f, new _immutable.List([]));
            self = objects.reduce(function (result, o) {
              var r = result;
              r = r.addSubobjectToSubarray(f, o);
              return r;
            }, self);
          });
          return self;
        }
      }, {
        key: "getSubobjectKeys",
        value: function getSubobjectKeys() {
          return this.constructor.getSubobjectKeys();
        }
      }, {
        key: "getSubobjectArrayKeys",
        value: function getSubobjectArrayKeys() {
          return this.constructor.getSubobjectArrayKeys();
        }
      }, {
        key: "getServiceOfType",
        value: function getServiceOfType(modelName) {
          return this.models[modelName];
        }
      }, {
        key: "keyIsOfTypeArray",
        value: function keyIsOfTypeArray(key) {
          var parentKey = _firstcutSchema.SchemaParser.getLeastNestedFieldName(key);

          return Array.isArray((0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "get", this).call(this, parentKey));
        }
      }, {
        key: "keyIsOfTypePlainObject",
        value: function keyIsOfTypePlainObject(key) {
          var parentKey = _firstcutSchema.SchemaParser.getLeastNestedFieldName(key);

          var value = (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "get", this).call(this, parentKey);
          return !(value instanceof _immutable.Record) && value instanceof Object;
        }
      }, {
        key: "getValueOfNestedArrayField",
        value: function getValueOfNestedArrayField(key) {
          var parentKey = _firstcutSchema.SchemaParser.getLeastNestedFieldName(key);

          var childKey = _firstcutSchema.SchemaParser.getMostNestedFieldName(key);

          var index = _firstcutSchema.SchemaParser.getIndexInObjectArrayField(key);

          if (childKey === index) {
            return (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), parentKey, this)[index];
          }

          return (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), parentKey, this)[index][childKey];
        }
      }, {
        key: "get",
        value: function get(key) {
          if (_firstcutSchema.SchemaParser.hasNestedFields(key)) {
            if (this.keyIsOfTypeArray(key)) {
              return this.getValueOfNestedArrayField(key);
            }

            var nestedFields = _firstcutSchema.SchemaParser.parseNestedFields(key);

            return this.getIn(nestedFields);
          }

          return (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "get", this).call(this, key);
        }
      }, {
        key: "set",
        value: function set(key, value) {
          var setBlueprint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

          if (key === 'blueprint' && setBlueprint && this.availableBlueprints) {
            var record = applyBlueprint(this, value);
            return record.set('blueprint', value, false);
          }

          if (_firstcutSchema.SchemaParser.hasNestedFields(key)) {
            if (this.keyIsOfTypeArray(key)) {
              var index = _firstcutSchema.SchemaParser.getIndexInObjectArrayField(key);

              var parentField = _firstcutSchema.SchemaParser.getLeastNestedFieldName(key);

              var childField = _firstcutSchema.SchemaParser.getMostNestedFieldName(key);

              var array = (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), parentField, this);

              if (childField === index) {
                array[index] = value;
              } else {
                array[index][childField] = value;
              }

              return (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "set", this).call(this, parentField, array);
            }

            var nestedFields = _firstcutSchema.SchemaParser.parseNestedFields(key);

            return this.setIn(nestedFields, value);
          }

          return (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "set", this).call(this, key, value);
        }
      }, {
        key: "validate",
        value: function validate() {
          return this.constructor.validate(this);
        }
      }, {
        key: "clean",
        value: function clean() {
          return this.constructor.persister.clean(this);
        }
      }, {
        key: "save",
        value: function save() {
          if ((0, _firstcutPlayers.inSimulationMode)()) {
            return;
          }

          var promise = this.constructor.persister.save(this);
          return promise;
        }
      }, {
        key: "remove",
        value: function remove() {
          return this.constructor.persister.remove(this);
        }
      }, {
        key: "getFieldLabel",
        value: function getFieldLabel(field) {
          return this.constructor.getFieldLabel(field);
        }
      }, {
        key: "model",
        get: function get() {
          return this.constructor;
        }
      }, {
        key: "country",
        get: function get() {
          return this.location ? this.location.country : DEFAULT_COUNTRY;
        }
      }, {
        key: "schema",
        get: function get() {
          return this.constructor.schema;
        }
      }, {
        key: "models",
        get: function get() {
          return this.constructor.models;
        }
      }, {
        key: "hasBeenSaved",
        get: function get() {
          return this.constructor.collection.findOne(this._id) != null;
        }
      }, {
        key: "blueprintLabel",
        get: function get() {
          return this.blueprint ? this.constructor.availableBlueprints[this.blueprint].label : '';
        }
      }, {
        key: "modelName",
        get: function get() {
          return this.constructor.modelName;
        }
      }, {
        key: "legacyModelName",
        get: function get() {
          return this.constructor.legacyModelName;
        }
      }, {
        key: "availableBlueprints",
        get: function get() {
          return this.constructor.availableBlueprints;
        }
      }, {
        key: "eventsInHistory",
        get: function get() {
          return (0, _firstcutActionUtils.eventsInHistory)(this.history);
        }
      }, {
        key: "publicFields",
        get: function get() {
          return this.schema.getPublicFields();
        }
      }, {
        key: "invoices",
        get: function get() {
          var type = this.legacyModelName;
          var gigId = this._id;
          return this.invoiceService.find({
            gigId: gigId,
            type: type
          });
        }
      }, {
        key: "clientService",
        get: function get() {
          return this.getServiceOfType('Client');
        }
      }, {
        key: "collaboratorService",
        get: function get() {
          return this.getServiceOfType('Collaborator');
        }
      }, {
        key: "companyService",
        get: function get() {
          return this.getServiceOfType('Company');
        }
      }, {
        key: "projectService",
        get: function get() {
          return this.getServiceOfType('Project');
        }
      }, {
        key: "shootService",
        get: function get() {
          return this.getServiceOfType('Shoot');
        }
      }, {
        key: "deliverableService",
        get: function get() {
          return this.getServiceOfType('Deliverable');
        }
      }, {
        key: "cutService",
        get: function get() {
          return this.getServiceOfType('Cut');
        }
      }, {
        key: "invoiceService",
        get: function get() {
          return this.getServiceOfType('Invoice');
        }
      }, {
        key: "taskService",
        get: function get() {
          return this.getServiceOfType('Task');
        }
      }], [{
        key: "createNew",
        value: function createNew(properties) {
          return new this(properties);
        }
      }, {
        key: "fromId",
        value: function fromId(id) {
          if (!id) {
            return null;
          }

          return this.find({
            _id: id
          }).get(0);
        }
      }, {
        key: "findOne",
        value: function findOne() {
          var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          return this.find(query).get(0);
        }
      }, {
        key: "find",
        value: function find() {
          var _this2 = this;

          var q = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          var _cleanQuery = cleanQuery(q, this.schema),
              query = _cleanQuery.query,
              notInSchemaQuery = _cleanQuery.notInSchemaQuery;

          var docs = this.collection.find(query).fetch();

          if (!docs) {
            return new _immutable.List([]);
          }

          docs = (0, _immutable.List)(docs.map(function (d) {
            return new _this2(d);
          }));

          if (!(0, _firstcutUtils.isEmpty)(notInSchemaQuery)) {
            docs = docs.filter(function (doc) {
              var fitsAllQueries = true;

              _lodash._.forEach(notInSchemaQuery, function (v, key) {
                var value = v;
                var fitsQuery = false;

                if (typeof value === 'function') {
                  fitsQuery = value(doc[key]);
                } else if (typeof doc[key] === 'function') {
                  fitsQuery = doc[key]() === value;
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
      }, {
        key: "count",
        value: function count() {
          var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          return this.find(query).count();
        }
      }, {
        key: "getFieldLabel",
        value: function getFieldLabel(field) {
          return this.schema.getFieldLabel(field);
        }
      }, {
        key: "validate",
        value: function validate(record) {
          var _this3 = this;

          var uniqueFields = this.schema.uniqueFields;
          uniqueFields.forEach(function (field) {
            if (record[field]) {
              if (_this3.findOne((0, _defineProperty2.default)({
                _id: {
                  $ne: record._id
                }
              }, field, record[field]))) {
                throw new ValidationError([{
                  name: field,
                  type: 'value must be unique',
                  message: "A record with ".concat(field, " ").concat(record[field], " already exists")
                }]);
              }
            }
          });
          this.schema.validate(record);
        }
      }, {
        key: "validator",
        value: function validator() {
          this.schema.validator();
        }
      }, {
        key: "getFileSchemaKeys",
        value: function getFileSchemaKeys() {
          return this.schema.getFileSchemaKeys();
        }
      }, {
        key: "getRelatedRecordSchemaKeys",
        value: function getRelatedRecordSchemaKeys(_ref) {
          var models = _ref.models;
          return this.schema.getRelatedRecordSchemaKeys({
            models: models
          });
        }
      }, {
        key: "getSubobjectKeys",
        value: function getSubobjectKeys() {
          return this.schema.subobjectKeys;
        }
      }, {
        key: "getSubobjectArrayKeys",
        value: function getSubobjectArrayKeys() {
          return this.schema.subobjectArrayKeys;
        }
      }, {
        key: "collection",
        get: function get() {
          if (!this._collection) {
            try {
              this._collection = new Mongo.Collection(this.collectionName);

              this._collection.attachSchema(this.schema.asSchema);
            } catch (e) {
              _pubsubJs.PubSub.publish('error', e);
            }
          }

          return this._collection;
        }
      }, {
        key: "models",
        set: function set(models) {
          this._models = models;
        },
        get: function get() {
          return this._models;
        }
      }, {
        key: "legacyModelName",
        get: function get() {
          return this.modelName.toUpperCase();
        }
      }, {
        key: "basepath",
        get: function get() {
          return "/".concat(this.collectionName);
        }
      }, {
        key: "schema",
        get: function get() {
          return this._schema;
        },
        set: function set(schema) {
          this._schema = schema;
        }
      }, {
        key: "availableBlueprints",
        get: function get() {
          return this._blueprints;
        },
        set: function set(blueprints) {
          this._blueprints = blueprints;
          this.schema.setBlueprintOptions(blueprints);
        }
      }]);
      return _class;
    }((0, _immutable.Record)((0, _objectSpread2.default)({}, defaultValues)))
  );
};

exports.BaseModel = BaseModel;

function applyBlueprint(r, blueprint) {
  var record = r;

  if (!blueprint) {
    throw new _meteor.Meteor.Error('malformed-params', 'Cannot apply blueprint when blueprint is undefined or null');
  }

  if (!record.availableBlueprints) {
    throw new _meteor.Meteor.Error('malformed-params', 'Record does not have available blueprints assigned to it. Cannot apply blueprint');
  }

  if (!record.availableBlueprints[blueprint]) {
    throw new _meteor.Meteor.Error('malformed-params', "Blueprint ".concat(blueprint, " not one of record's available blueprints"));
  }

  var defaults = record.availableBlueprints[blueprint].defaults;
  Object.keys(defaults).forEach(function (key) {
    record = record.set(key, defaults[key]);
  });
  return record;
}

function cleanQuery(q, schema) {
  var defined = reduceToDefinedFields(q);
  var flattenedMap = flattenNestedFields(defined);

  var _segmentIntoSchemaAnd = segmentIntoSchemaAndNotSchemaQueries(flattenedMap, schema),
      query = _segmentIntoSchemaAnd.query,
      notInSchemaQuery = _segmentIntoSchemaAnd.notInSchemaQuery;

  return {
    query: query,
    notInSchemaQuery: notInSchemaQuery
  };
}

function segmentIntoSchemaAndNotSchemaQueries(obj, schema) {
  var query = obj;
  var notInSchemaQuery = {};

  _lodash._.forEach(obj, function (value, key) {
    if (!schema.fieldIsInSchema(key)) {
      notInSchemaQuery[key] = value;
      delete query[key];
    }
  });

  return {
    query: query,
    notInSchemaQuery: notInSchemaQuery
  };
}

function reduceToDefinedFields(obj) {
  return reduceObj(obj, function (accumulated, field) {
    var result = accumulated;
    var value = obj[field];

    if (_lodash._.isPlainObject(value)) {
      var defined = reduceToDefinedFields(value);

      if (!_lodash._.isEmpty(defined)) {
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
  return reduceObj(m, function (accumulated, field) {
    var result = accumulated;
    var value = m[field];

    if (_lodash._.isPlainObject(value)) {
      _lodash._.forEach(_lodash._.keys(value), function (subfield) {
        if (!isMongoOperator(subfield) && typeof subfield !== 'function') {
          // e.g. {"contact": {"name": "value"}}
          var queryKey = _firstcutSchema.SchemaParser.buildObjectField(field, subfield);

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
  return _lodash._.reduce(_lodash._.keys(obj), func, seed);
}

var _default = createBaseModel;
exports.default = _default;