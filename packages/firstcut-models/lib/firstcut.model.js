"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FirstCutModel = void 0;

var _baseModel = require("./base.model.js");

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FirstCutModel = function FirstCutModel(defaultValues) {
  return (
    /*#__PURE__*/
    function (_BaseModel) {
      _inherits(_class, _BaseModel);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
      }

      _createClass(_class, [{
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
              if (_this.findOne(_defineProperty({
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
    }((0, _baseModel.BaseModel)(_objectSpread({}, defaultValues)))
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
  Object.keys(defaults).forEach(function (key) {
    return record = record.set(key, defaults[key]);
  });
  return record;
}