"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FirstCutModel = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _baseModel = require("./base.model.js");

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

var FirstCutModel = function FirstCutModel(defaultValues) {
  return (
    /*#__PURE__*/
    function (_BaseModel) {
      (0, _inherits2.default)(_class, _BaseModel);

      function _class() {
        (0, _classCallCheck2.default)(this, _class);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).apply(this, arguments));
      }

      (0, _createClass2.default)(_class, [{
        key: "generateDependentRecords",
        value: function generateDependentRecords() {
          return [];
        } // inheritors can override this

      }, {
        key: "appendToHistory",
        value: function appendToHistory(event_data) {
          var self = this.nestedStructuresToImmutables();
          var result = self.addSubobjectToSubarray('history', event_data);
          return result;
        }
      }, {
        key: "getEventsOfType",
        value: function getEventsOfType(event_name) {
          return this.history.toArray().filter(function (event) {
            return event.event == event_name;
          });
        }
      }, {
        key: "getEventId",
        value: function getEventId(event_name) {
          return this._getHistoryField({
            event_name: event_name,
            field: 'event_id'
          });
        }
      }, {
        key: "_getHistoryField",
        value: function _getHistoryField(_ref) {
          var event_name = _ref.event_name,
              field = _ref.field;
          var events = this.getEventsOfType(event_name);

          var with_field = _.first(events.filter(function (event) {
            return event[field] != null;
          }));

          return with_field ? with_field[field] : null;
        }
      }, {
        key: "blueprintLabel",
        get: function get() {
          return this.blueprint ? this.constructor.available_blueprints[this.blueprint].label : "";
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
        key: "invoiceCount",
        get: function get() {
          return this.invoices ? this.invoices.count() : 0;
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
        key: "locationUrl",
        get: function get() {
          return _firstcutSchemaBuilder.LocationParser.locationUrl(this);
        }
      }, {
        key: "locationDisplayName",
        get: function get() {
          return _firstcutSchemaBuilder.LocationParser.locationDisplayName(this);
        }
      }, {
        key: "cityDisplayName",
        get: function get() {
          return _firstcutSchemaBuilder.LocationParser.cityDisplayName(this);
        }
      }, {
        key: "projectDisplayName",
        get: function get() {
          return this.project ? this.project.displayName : '';
        }
      }, {
        key: "clientDisplayName",
        get: function get() {
          return this.client ? this.client.displayName : '';
        }
      }, {
        key: "deliverableDisplayName",
        get: function get() {
          return this.deliverable ? this.deliverable.displayName : '';
        }
      }, {
        key: "postpoOwnerDisplayName",
        get: function get() {
          return this.postpoOwner ? this.postpoOwner.displayName : '';
        }
      }, {
        key: "adminOwnerDisplayName",
        get: function get() {
          return this.adminOwner ? this.adminOwner.displayName : "";
        }
      }, {
        key: "clientOwnerDisplayName",
        get: function get() {
          return this.clientOwner ? this.clientOwner.displayName : "";
        }
      }, {
        key: "postpoOwnerEmail",
        get: function get() {
          return this.postpoOwner ? this.postpoOwner.email : '';
        }
      }, {
        key: "adminOwnerEmail",
        get: function get() {
          return this.adminOwner ? this.adminOwner.email : "";
        }
      }, {
        key: "clientOwnerEmail",
        get: function get() {
          return this.clientOwner ? this.clientOwner.email : "";
        }
      }, {
        key: "companyDisplayName",
        get: function get() {
          return this.company ? this.company.displayName : "";
        }
      }], [{
        key: "validate",
        value: function validate(record) {
          var _this = this;

          var unique_fields = this.schema.unique_fields;
          unique_fields.map(function (field) {
            if (record[field]) {
              if (_this.findOne((0, _defineProperty2.default)({
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
        key: "available_blueprints",
        get: function get() {
          return this._blueprints;
        },
        set: function set(blueprints) {
          this._blueprints = blueprints;
          this.schema.setBlueprintOptions(blueprints);
        }
      }]);
      return _class;
    }((0, _baseModel.BaseModel)((0, _objectSpread2.default)({}, defaultValues)))
  );
};

exports.FirstCutModel = FirstCutModel;

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
  (0, _keys.default)(defaults).forEach(function (key) {
    return record = record.set(key, defaults[key]);
  });
  return record;
}