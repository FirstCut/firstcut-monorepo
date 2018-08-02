"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getOwnPropertyNames = _interopRequireDefault(require("@babel/runtime/core-js/object/get-own-property-names"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _schemaParser = _interopRequireDefault(require("./schema.parser.js"));

var _lodash = require("lodash");

_simplSchema.default.extendOptions(['helpText', 'sortBy', 'options', 'placeholder', 'hidden', 'customType', 'store', 'serviceFilter', 'enumOptions', 'restricted', 'unique', 'serviceDependency']);

var FCSchema =
/*#__PURE__*/
function () {
  (0, _createClass2.default)(FCSchema, null, [{
    key: "fromSubSchema",
    value: function fromSubSchema(schema, field) {
      var quick_type_1 = schema.getQuickTypeForKey(field);

      if (quick_type_1 == 'object') {
        field = _schemaParser.default.fieldAsObjectKey(field);
      } else if (quick_type_1 == 'objectArray') {
        field = _schemaParser.default.fieldAsObjectArrayKey(field);
      }

      var result = {};
      var nested_fields = schema.getObjectKeys(field);
      nested_fields.forEach(function (subfield) {
        var nested_key = field + subfield;
        result[subfield] = schema.getFieldSchema(nested_key);
      });
      return new this(result);
    }
  }, {
    key: "fromFields",
    value: function fromFields(schema, fields) {
      var subschema = {};
      fields.forEach(function (field) {
        subschema[field] = schema.getFieldSchema(field);
      });
      return new SimpleSchemaWrapper(subschema);
    }
  }]);

  function FCSchema(props) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, FCSchema);
    // if (options.restrict_fields) {
    //   props = _.reduce(props, (result, value, key) => {
    //     const parent_key = SchemaParser.getLeastNestedFieldName(key);
    //     if (!value.restricted && !props[parent_key].restricted) {
    //       result[key] = value;
    //     }
    //     return result;
    //   }, {});
    // }
    this.as_json = (0, _objectSpread2.default)({}, props);
    this.error_messages = {};

    this._precalculateProperties();
  }

  (0, _createClass2.default)(FCSchema, [{
    key: "publicFieldsOnly",
    value: function publicFieldsOnly() {
      return new this.constructor(this.as_json, {
        restrict_fields: true
      });
    }
  }, {
    key: "extend",
    value: function extend(schema) {
      this.as_json = _lodash._.merge(this.as_json, schema);

      this._precalculateProperties();
    }
  }, {
    key: "getPublicFields",
    value: function getPublicFields() {
      var _this = this;

      var isPublic = function isPublic(key) {
        return _this.as_json[key] && _this.as_json[key].public == true;
      };

      var getKey = function getKey(key) {
        return key;
      };

      return this.findFieldsSatisfyingCondition((0, _keys.default)(this.as_json), isFileSchemaKey, getKey);
    }
  }, {
    key: "getFileSchemaKeys",
    value: function getFileSchemaKeys() {
      var _this2 = this;

      var isFileSchemaKey = function isFileSchemaKey(key) {
        return _this2.as_json[key] && _this2.as_json[key].customType == 'file';
      };

      var getKey = function getKey(key) {
        return key;
      };

      return this.findFieldsSatisfyingCondition((0, _keys.default)(this.as_json), isFileSchemaKey, getKey);
    }
  }, {
    key: "getRelatedRecordSchemaKeys",
    value: function getRelatedRecordSchemaKeys(_ref) {
      var _this3 = this;

      var models = _ref.models;
      var model_names = models.map(function (model) {
        return [model.legacy_model_name, model.model_name];
      });
      model_names = _lodash._.flatten(model_names);

      var serviceDependencyInModels = function serviceDependencyInModels(key) {
        return _this3.as_json[key] && model_names.includes(_this3.as_json[key].serviceDependency);
      };

      var getKey = function getKey(key) {
        return key;
      };

      return this.findFieldsSatisfyingCondition((0, _keys.default)(this.as_json), serviceDependencyInModels, getKey);
    }
  }, {
    key: "_precalculateProperties",
    value: function _precalculateProperties() {
      this.asSchema = this._getAsSchema();
      this.subobject_keys = this._findSubobjectFields();
      this.subobjectarray_keys = this._findSubobjectArrayFields();
      this.public_fields = this._findPublicFields();
      this.unique_fields = this._findUniqueFields();
    }
  }, {
    key: "_getAsSchema",
    value: function _getAsSchema() {
      var schema = new _simplSchema.default(this.as_json, {
        requiredByDefault: false
      });
      schema.messageBox.messages(this.error_messages);
      return schema;
    }
  }, {
    key: "_findSubobjectFields",
    value: function _findSubobjectFields() {
      var condition = this.isSubobjectField.bind(this);
      var get_key = _schemaParser.default.fieldAsObjectKey;
      return this.findObjectKeysSatisfyingCondition(condition, get_key);
    }
  }, {
    key: "_findUniqueFields",
    value: function _findUniqueFields() {
      var condition = this.isUniqueField.bind(this);

      var get_key = function get_key(key) {
        return key;
      };

      return this.findObjectKeysSatisfyingCondition(condition, get_key);
    }
  }, {
    key: "_findPublicFields",
    value: function _findPublicFields() {
      var condition = this.isPublicField.bind(this);

      var get_key = function get_key(key) {
        return key;
      };

      return this.findObjectKeysSatisfyingCondition(condition, get_key);
    }
  }, {
    key: "_findSubobjectArrayFields",
    value: function _findSubobjectArrayFields() {
      var condition = this.isSubobjectArrayField.bind(this);
      var get_key = _schemaParser.default.fieldAsObjectArrayKey;
      return this.findObjectKeysSatisfyingCondition(condition, get_key);
    }
  }, {
    key: "findObjectKeysSatisfyingCondition",
    value: function findObjectKeysSatisfyingCondition(getCondition, getKey) {
      return this.findFieldsSatisfyingCondition(this.objectKeys(), getCondition, getKey);
    }
  }, {
    key: "findFieldsSatisfyingCondition",
    //good idea but unclear concept -- rework slightly or comment
    value: function findFieldsSatisfyingCondition(keys, getCondition, getKey) {
      var fields = [];
      keys.forEach(function (field) {
        //TODO: use filter
        if (getCondition(field)) {
          var obj_key = getKey(field);
          fields.push(field);
        }
      });
      return fields;
    }
  }, {
    key: "getFieldLabel",
    value: function getFieldLabel(field) {
      return this.asSchema.label(field);
    }
  }, {
    key: "getFieldSchema",
    value: function getFieldSchema(field) {
      if (_schemaParser.default.hasNestedFields(field)) {
        field = _schemaParser.default.unindexObjectArrayField(field);
      }

      return _lodash._.get(this.as_json, field);
    }
  }, {
    key: "getObjectKeys",
    value: function getObjectKeys(field) {
      return this.asSchema._objectKeys[field] || [];
    }
  }, {
    key: "getNestedKeysForObjectArray",
    value: function getNestedKeysForObjectArray(field) {
      var key = _schemaParser.default.fieldAsObjectArrayKey(field);

      return this.getObjectKeys(key);
    }
  }, {
    key: "getKeysForObjectArray",
    value: function getKeysForObjectArray(field) {
      return this.getNestedKeysForObjectArray(field).map(function (k) {
        return _schemaParser.default.buildObjectArrayField(field, k);
      });
    }
  }, {
    key: "isSubobjectArrayField",
    value: function isSubobjectArrayField(field) {
      return this.getQuickTypeForKey(field) == 'objectArray';
    }
  }, {
    key: "isPublicField",
    value: function isPublicField(field) {
      return !this.as_json[field].restricted;
    }
  }, {
    key: "isUniqueField",
    value: function isUniqueField(field) {
      return this.as_json[field].unique === true;
    }
  }, {
    key: "objectKeys",
    value: function objectKeys() {
      return this.asSchema.objectKeys();
    }
  }, {
    key: "isSubobjectField",
    value: function isSubobjectField(f) {
      return this.getQuickTypeForKey(f) == 'object';
    }
  }, {
    key: "getQuickTypeForKey",
    value: function getQuickTypeForKey(field) {
      var quick_type = this.asSchema.getQuickTypeForKey(field);

      if (!quick_type) {
        var def = this.asSchema.getObjectSchema(field).getDefinition();
        if ((0, _getOwnPropertyNames.default)(def).length > 0) quick_type = 'object';
      }

      return quick_type;
    }
  }, {
    key: "validate",
    value: function validate(args) {
      return this.asSchema.validate(args);
    }
  }, {
    key: "validator",
    value: function validator() {
      return this.asSchema.validator();
    }
  }, {
    key: "clean",
    value: function clean(record) {
      return this.asSchema.clean(record, {
        autoConvert: true,
        removeNullsFromArrays: true,
        removeEmptyStrings: true,
        trimStrings: true,
        getAutoValues: true
      });
    }
  }, {
    key: "addErrorMessages",
    value: function addErrorMessages(msgs) {
      this.error_messages = (0, _objectSpread2.default)({}, this.error_messages, {
        msgs: msgs
      });
    }
  }]);
  return FCSchema;
}();

exports.default = FCSchema;