"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseModel = void 0;

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

var _immutable = require("immutable");

var _firstcutUtils = require("firstcut-utils");

var _factories = _interopRequireDefault(require("./utils/factories.js"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DEFAULT_COUNTRY = 'United States';

var BaseModel = function BaseModel(defaultValues) {
  return (
    /*#__PURE__*/
    function (_Record) {
      _inherits(_class, _Record);

      _createClass(_class, [{
        key: "createNew",
        value: function createNew(properties) {
          return this.constructor.createNew(properties);
        }
        /* TODO: hide this better */

      }, {
        key: "isOfType",
        value: function isOfType(model) {
          return model.model_name == this.model_name;
        }
      }, {
        key: "newSubrecordFromKey",
        value: function newSubrecordFromKey(key, properties) {
          var object_schema = this.schema.constructor.fromSubSchema(this.schema, key);
          var subobject_record = (0, _factories.default)(_immutable.Record, object_schema);
          return new subobject_record(properties);
        }
      }, {
        key: "addSubobjectToSubarray",
        value: function addSubobjectToSubarray(field, properties) {
          var obj = this.newSubrecordFromKey(field, properties);
          var new_arr = this[field].push(obj);
          return this.set(field, new_arr);
        }
      }, {
        key: "removeSubobjectFromSubarray",
        value: function removeSubobjectFromSubarray(field, index) {
          var new_arr = this[field].remove(index);
          return this.set(field, new_arr);
        }
      }, {
        key: "nestedStructuresToImmutables",
        value: function nestedStructuresToImmutables() {
          var self = this.initializeSubobjects();
          return self.initializeSubobjectArrays();
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
          var _this = this;

          var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          query = cleanQuery(query);
          var docs = this.collection.find(query).fetch();

          if (!docs) {
            return new _immutable.List([]);
          }

          return (0, _immutable.List)(docs.map(function (d) {
            return new _this(d);
          }));
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
        key: "collection",
        get: function get() {
          if (!this._collection) {
            this._collection = new Mongo.Collection(this.collection_name); // this._collection.attachSchema(this.schema.asSchema);
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
        key: "legacy_model_name",
        get: function get() {
          return this.model_name.toUpperCase();
        }
      }, {
        key: "model_name",
        get: function get() {
          return this._model_name;
        },
        set: function set(name) {
          this._model_name = name;
        }
      }, {
        key: "basepath",
        get: function get() {
          return "/" + this.collection_name;
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
        key: "available_blueprints",
        get: function get() {
          return this._blueprints;
        },
        set: function set(blueprints) {
          this._blueprints = blueprints;
          this.schema.setBlueprintOptions(blueprints);
        }
      }, {
        key: "_subobject_keys",
        get: function get() {
          return this.schema.subobject_keys;
        }
      }, {
        key: "_subobjectarray_keys",
        get: function get() {
          return this.schema.subobjectarray_keys;
        }
      }]);

      function _class(properties) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, _objectSpread({}, properties))); // if (!options.prevent_initialization_of_nested_structures) {
        //   let self = this.initializeSubobjects();
        //   return self.initializeSubobjectArrays();
        // }
      }

      _createClass(_class, [{
        key: "initializeSubobjects",
        value: function initializeSubobjects() {
          var _this2 = this;

          var fields = this._subobject_keys;
          var self = this;
          fields.forEach(function (f) {
            var subobject = _this2.get(f);

            var subrecord = _this2.newSubrecordFromKey(f, subobject);

            self = self.set(f, subrecord);
          });
          return self;
        }
      }, {
        key: "initializeSubobjectArrays",
        value: function initializeSubobjectArrays() {
          var fields = this._subobjectarray_keys;
          var self = this;
          fields.forEach(function (f) {
            var objects = self.get(f);
            self = self.set(f, new _immutable.List([]));
            objects.forEach(function (o) {
              return self = self.addSubobjectToSubarray(f, o);
            });
          });
          return self;
        }
      }, {
        key: "keyIsOfTypeArray",
        value: function keyIsOfTypeArray(key) {
          var parent_key = _firstcutSchemaBuilder.SchemaParser.getLeastNestedFieldName(key);

          return Array.isArray(_get(_getPrototypeOf(_class.prototype), "get", this).call(this, parent_key));
        }
      }, {
        key: "keyIsOfTypePlainObject",
        value: function keyIsOfTypePlainObject(key) {
          var parent_key = _firstcutSchemaBuilder.SchemaParser.getLeastNestedFieldName(key);

          var value = _get(_getPrototypeOf(_class.prototype), "get", this).call(this, parent_key);

          return !(value instanceof _immutable.Record) && value instanceof Object;
        }
      }, {
        key: "getValueOfNestedArrayField",
        value: function getValueOfNestedArrayField(key) {
          var parent_key = _firstcutSchemaBuilder.SchemaParser.getLeastNestedFieldName(key);

          var child_key = _firstcutSchemaBuilder.SchemaParser.getMostNestedFieldName(key);

          var index = _firstcutSchemaBuilder.SchemaParser.getIndexInObjectArrayField(key);

          if (child_key == index) {
            return _get(_getPrototypeOf(_class.prototype), parent_key, this)[index];
          }

          return _get(_getPrototypeOf(_class.prototype), parent_key, this)[index][child_key];
        }
      }, {
        key: "get",
        value: function get(key) {
          if (_firstcutSchemaBuilder.SchemaParser.hasNestedFields(key)) {
            if (this.keyIsOfTypeArray(key)) {
              return this.getValueOfNestedArrayField(key);
            }

            var nested_fields = _firstcutSchemaBuilder.SchemaParser.parseNestedFields(key);

            return this.getIn(nested_fields);
          }

          return _get(_getPrototypeOf(_class.prototype), "get", this).call(this, key);
        }
      }, {
        key: "set",
        value: function set(key, value) {
          var apply_blueprint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

          if (key == 'blueprint' && apply_blueprint && this.available_blueprints) {
            var record = applyBlueprint(this, value);
            return record.set('blueprint', value, false);
          } else {
            if (_firstcutSchemaBuilder.SchemaParser.hasNestedFields(key)) {
              if (this.keyIsOfTypeArray(key)) {
                var index = _firstcutSchemaBuilder.SchemaParser.getIndexInObjectArrayField(key);

                var parent_field = _firstcutSchemaBuilder.SchemaParser.getLeastNestedFieldName(key);

                var child_field = _firstcutSchemaBuilder.SchemaParser.getMostNestedFieldName(key);

                var array = _get(_getPrototypeOf(_class.prototype), parent_field, this);

                if (child_field == index) {
                  array[index] = value;
                } else {
                  array[index][child_field] = value;
                }

                return _get(_getPrototypeOf(_class.prototype), "set", this).call(this, parent_field, array);
              }

              var nested_fields = _firstcutSchemaBuilder.SchemaParser.parseNestedFields(key);

              return this.setIn(nested_fields, value);
            }

            return _get(_getPrototypeOf(_class.prototype), "set", this).call(this, key, value);
          }
        }
      }, {
        key: "save",
        value: function save() {
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
        key: "createdByRecord",
        get: function get() {
          return (0, _firstcutUtils.getPlayer)(this.models, this.createdBy);
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
        key: "_subobject_keys",
        get: function get() {
          return this.constructor._subobject_keys;
        }
      }, {
        key: "_subobjectarray_keys",
        get: function get() {
          return this.constructor._subobjectarray_keys;
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
        key: "has_been_saved",
        get: function get() {
          return this.constructor.collection.findOne(this._id) != null;
        }
      }, {
        key: "blueprintLabel",
        get: function get() {
          return this.blueprint ? this.constructor.available_blueprints[this.blueprint].label : "";
        }
      }, {
        key: "model_name",
        get: function get() {
          return this.constructor.model_name;
        },
        set: function set(name) {
          this.constructor.model_name = name;
        }
      }, {
        key: "legacy_model_name",
        get: function get() {
          return this.constructor.legacy_model_name;
        }
      }, {
        key: "available_blueprints",
        get: function get() {
          return this.constructor.available_blueprints;
        }
      }, {
        key: "eventsInHistory",
        get: function get() {
          return this.history.map(function (event) {
            return event.event;
          });
        }
      }, {
        key: "public_fields",
        get: function get() {
          return this.schema.getPublicFields();
        }
      }, {
        key: "invoices",
        get: function get() {
          var type = this.legacy_model_name;
          var gigId = this._id;
          return this.invoiceService.find({
            gigId: gigId,
            type: type
          });
        }
      }, {
        key: "clientService",
        get: function get() {
          return this.models.Client;
        }
      }, {
        key: "collaboratorService",
        get: function get() {
          return this.models.Collaborator;
        }
      }, {
        key: "companyService",
        get: function get() {
          return this.models.Company;
        }
      }, {
        key: "projectService",
        get: function get() {
          return this.models.Project;
        }
      }, {
        key: "shootService",
        get: function get() {
          return this.models.Shoot;
        }
      }, {
        key: "deliverableService",
        get: function get() {
          return this.models.Deliverable;
        }
      }, {
        key: "cutService",
        get: function get() {
          return this.models.Cut;
        }
      }, {
        key: "invoiceService",
        get: function get() {
          return this.models.Invoice;
        }
      }]);

      return _class;
    }((0, _immutable.Record)(_objectSpread({}, defaultValues)))
  );
};

exports.BaseModel = BaseModel;

function applyBlueprint(record, blueprint) {
  if (!blueprint) {
    throw new Meteor.Error('malformed-params', 'Cannot apply blueprint when blueprint is undefined or null');
  }

  if (!record.available_blueprints) {
    throw new Meteor.Error('malformed-params', 'Record does not have available blueprints assigned to it. Cannot apply blueprint');
  }

  if (!record.available_blueprints[blueprint]) {
    throw new Meteor.Error('malformed-params', "Blueprint ".concat(blueprint, " not one of record's available blueprints"));
  }

  var defaults = record.available_blueprints[blueprint].defaults;
  Object.keys(defaults).forEach(function (key) {
    return record = record.set(key, defaults[key]);
  });
  return record;
}

function cleanQuery(q) {
  var defined = reduceToDefinedFields(q);
  var flattened_map = flattenNestedFields(defined);
  return flattened_map;
}

function reduceToDefinedFields(obj) {
  return reduceObj(obj, function (result, field) {
    var value = obj[field];

    if (_lodash._.isPlainObject(value)) {
      var defined = reduceToDefinedFields(value);

      if (!_lodash._.isEmpty(defined)) {
        result[field] = defined;
      }
    } else if (value != null && value !== '') {
      result[field] = value;
    }

    return result;
  }, {});
}

function flattenNestedFields(m) {
  return reduceObj(m, function (result, field) {
    var value = m[field];

    if (_lodash._.isObject(value)) {
      _lodash._.forEach(_lodash._.keys(value), function (subfield) {
        if (!isMongoOperator(subfield)) {
          //e.g. {"contact": {"name": "value}}
          var query_key = _firstcutSchemaBuilder.SchemaParser.buildObjectField(field, subfield);

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
  return _lodash._.reduce(_lodash._.keys(obj), func, seed);
}