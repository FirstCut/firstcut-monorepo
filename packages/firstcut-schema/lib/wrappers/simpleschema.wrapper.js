"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _lodash = require("lodash");

var _parser = _interopRequireDefault(require("../parser"));

_simplSchema.default.extendOptions(['helpText', 'sortBy', 'options', 'placeholder', 'hidden', 'customType', 'rows', 'store', 'bucket', 'serviceFilter', 'enumOptions', 'unique', 'restricted', 'customAutoValue', 'serviceDependency']);

var SimpleSchemaWrapper =
/*#__PURE__*/
function () {
  (0, _createClass2.default)(SimpleSchemaWrapper, null, [{
    key: "fromSubSchema",
    value: function fromSubSchema(schema, f) {
      var field = f;
      var quickType = schema.getQuickTypeForKey(field);

      if (quickType === 'object') {
        field = _parser.default.fieldAsObjectKey(field);
      } else if (quickType === 'objectArray') {
        field = _parser.default.fieldAsObjectArrayKey(field);
      }

      var nestedFields = schema.getObjectKeys(field);
      var result = {};
      nestedFields.forEach(function (subfield) {
        var nestedKey = field + subfield;
        result[subfield] = schema.getFieldSchema(nestedKey);
      });
      return new SimpleSchemaWrapper(result);
    }
  }, {
    key: "fromFields",
    value: function fromFields(schema, fields) {
      var subschema = fields.reduce(function (r, field) {
        var result = r;
        result[field] = schema.getFieldSchema(field);
        return result;
      }, {});
      return new SimpleSchemaWrapper(subschema);
    }
  }]);

  function SimpleSchemaWrapper(props) {
    (0, _classCallCheck2.default)(this, SimpleSchemaWrapper);

    _simplSchema.default.extendOptions(['helpText', 'sortBy', 'options', 'placeholder', 'hidden', 'customType', 'rows', 'store', 'bucket', 'serviceFilter', 'enumOptions', 'unique', 'restricted', 'customAutoValue', 'serviceDependency']);

    this.asJson = (0, _objectSpread2.default)({}, props);
    this.errorMessages = {};
  }

  (0, _createClass2.default)(SimpleSchemaWrapper, [{
    key: "publicFieldsOnly",
    value: function publicFieldsOnly() {
      return new this.constructor(this.asJson, {
        restrict_fields: true
      });
    }
  }, {
    key: "extend",
    value: function extend(schema) {
      this.asJson = _lodash._.merge(this.asJson, schema);
    }
  }, {
    key: "fieldIsInSchema",
    value: function fieldIsInSchema(key) {
      var field = _parser.default.getLeastNestedFieldName(key);

      return this.asJson[field] != null;
    }
  }, {
    key: "getPublicFields",
    value: function getPublicFields() {
      var _this = this;

      var isPublic = function isPublic(key) {
        return _this.asJson[key] && _this.asJson[key].public === true;
      };

      var getKey = function getKey(key) {
        return key;
      };

      return findFieldsSatisfyingCondition(Object.keys(this.asJson), isPublic, getKey);
    }
  }, {
    key: "getFileSchemaKeys",
    value: function getFileSchemaKeys() {
      var _this2 = this;

      var isFileSchemaKey = function isFileSchemaKey(key) {
        return _this2.asJson[key] && _this2.asJson[key].customType === 'file';
      };

      var getKey = function getKey(key) {
        return key;
      };

      return findFieldsSatisfyingCondition(Object.keys(this.asJson), isFileSchemaKey, getKey);
    }
  }, {
    key: "getRelatedRecordSchemaKeys",
    value: function getRelatedRecordSchemaKeys(_ref) {
      var _this3 = this;

      var models = _ref.models;
      var modelNames = models.map(function (model) {
        return [model.legacyModelName, model.modelName];
      });
      modelNames = _lodash._.flatten(modelNames);

      var serviceDependencyInModels = function serviceDependencyInModels(key) {
        return _this3.asJson[key] && modelNames.includes(_this3.asJson[key].serviceDependency);
      };

      var getKey = function getKey(key) {
        return key;
      };

      return findFieldsSatisfyingCondition(Object.keys(this.asJson), serviceDependencyInModels, getKey);
    }
  }, {
    key: "_getAsSchema",
    value: function _getAsSchema() {
      var schema = new _simplSchema.default(this.asJson, {
        requiredByDefault: false
      });
      schema.messageBox.messages(this.errorMessages);
      return schema;
    }
  }, {
    key: "_findSubobjectFields",
    value: function _findSubobjectFields() {
      var condition = this.isSubobjectField.bind(this);
      var getKey = _parser.default.fieldAsObjectKey;
      return this.findObjectKeysSatisfyingCondition(condition, getKey);
    }
  }, {
    key: "_findUniqueFields",
    value: function _findUniqueFields() {
      var condition = this.isUniqueField.bind(this);

      var getKey = function getKey(key) {
        return key;
      };

      return this.findObjectKeysSatisfyingCondition(condition, getKey);
    }
  }, {
    key: "_findPublicFields",
    value: function _findPublicFields() {
      var condition = this.isPublicField.bind(this);

      var getKey = function getKey(key) {
        return key;
      };

      return this.findObjectKeysSatisfyingCondition(condition, getKey);
    }
  }, {
    key: "_findCustomAutovalueFields",
    value: function _findCustomAutovalueFields() {
      var condition = this.isCustomAutovalueField.bind(this);

      var getKey = function getKey(key) {
        return key;
      };

      return this.findObjectKeysSatisfyingCondition(condition, getKey);
    }
  }, {
    key: "_findSubobjectArrayFields",
    value: function _findSubobjectArrayFields() {
      var condition = this.isSubobjectArrayField.bind(this);
      var getKey = _parser.default.fieldAsObjectArrayKey;
      return this.findObjectKeysSatisfyingCondition(condition, getKey);
    }
  }, {
    key: "findObjectKeysSatisfyingCondition",
    value: function findObjectKeysSatisfyingCondition(getCondition, getKey) {
      return findFieldsSatisfyingCondition(this.objectKeys(), getCondition, getKey);
    }
  }, {
    key: "getFieldLabel",
    value: function getFieldLabel(field) {
      return this.asSchema.label(field);
    }
  }, {
    key: "getFieldSchema",
    value: function getFieldSchema(f) {
      var field = f;

      if (_parser.default.hasNestedFields(field)) {
        field = _parser.default.unindexObjectArrayField(field);
      }

      return _lodash._.get(this.asJson, field);
    }
  }, {
    key: "getObjectKeys",
    value: function getObjectKeys(field) {
      return this.asSchema._objectKeys[field] || [];
    }
  }, {
    key: "getNestedKeysForObjectArray",
    value: function getNestedKeysForObjectArray(field) {
      var key = _parser.default.fieldAsObjectArrayKey(field);

      return this.getObjectKeys(key);
    }
  }, {
    key: "getKeysForObjectArray",
    value: function getKeysForObjectArray(field) {
      return this.getNestedKeysForObjectArray(field).map(function (k) {
        return _parser.default.buildObjectArrayField(field, k);
      });
    }
  }, {
    key: "isSubobjectArrayField",
    value: function isSubobjectArrayField(field) {
      return this.getQuickTypeForKey(field) === 'objectArray';
    }
  }, {
    key: "isCustomAutovalueField",
    value: function isCustomAutovalueField(field) {
      return this.asJson[field].customAutoValue != null;
    }
  }, {
    key: "isPublicField",
    value: function isPublicField(field) {
      return !this.asJson[field].restricted;
    }
  }, {
    key: "isUniqueField",
    value: function isUniqueField(field) {
      return this.asJson[field].unique === true;
    }
  }, {
    key: "objectKeys",
    value: function objectKeys() {
      return this.asSchema.objectKeys();
    }
  }, {
    key: "allFields",
    value: function allFields() {
      return this.asSchema._schemaKeys;
    }
  }, {
    key: "isSubobjectField",
    value: function isSubobjectField(f) {
      return this.getQuickTypeForKey(f) === 'object';
    }
  }, {
    key: "getQuickTypeForKey",
    value: function getQuickTypeForKey(field) {
      var quickType = this.asSchema.getQuickTypeForKey(field);

      if (!quickType) {
        var def = this.asSchema.getObjectSchema(field).getDefinition();
        if (Object.getOwnPropertyNames(def).length > 0) quickType = 'object';
      }

      return quickType;
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
      if (record.toJS) {
        record = record.toJS();
      }

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
      this.errorMessages = (0, _objectSpread2.default)({}, this.errorMessages, {
        msgs: msgs
      });
    }
  }, {
    key: "customAutovalueFields",
    get: function get() {
      if (!this._customAutovalueFields) {
        this._customAutovalueFields = this._findCustomAutovalueFields();
      }

      return this._customAutovalueFields;
    }
  }, {
    key: "uniqueFields",
    get: function get() {
      if (!this._uniqueFields) {
        this._uniqueFields = this._findUniqueFields();
      }

      return this._uniqueFields;
    }
  }, {
    key: "publicFields",
    get: function get() {
      if (!this._publicFields) {
        this._publicFields = this._findPublicFields();
      }

      return this._publicFields;
    }
  }, {
    key: "subobjectArrayKeys",
    get: function get() {
      if (!this._subobjectArrayKeys) {
        this._subobjectArrayKeys = this._findSubobjectArrayFields();
      }

      return this._subobjectArrayKeys;
    }
  }, {
    key: "asSchema",
    get: function get() {
      if (!this._asSchema) {
        this._asSchema = this._getAsSchema();
      }

      return this._asSchema;
    }
  }, {
    key: "subobjectKeys",
    get: function get() {
      if (!this._subobjectKeys) {
        this._subobjectKeys = this._findSubobjectFields();
      }

      return this._subobjectKeys;
    }
  }]);
  return SimpleSchemaWrapper;
}(); // good idea but unclear concept -- rework slightly or comment


exports.default = SimpleSchemaWrapper;

function findFieldsSatisfyingCondition(keys, getCondition, getKey) {
  var fields = [];
  keys.forEach(function (field) {
    // TODO: use filter
    if (getCondition(field)) {
      // const objKey = getKey(field); // need to review why this wasn't working again
      fields.push(field);
    }
  });
  return fields;
}