"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _lodash = require("lodash");

var _base = require("./base.model");

var _schema = require("/imports/api/schema");

var _firstcutRetrieveUrl = require("firstcut-retrieve-url");

var _generateDefaults = _interopRequireDefault(require("./utils/generate-defaults"));

var _actions = require("/imports/api/actions");

function createFirstCutModel(schema) {
  return FirstCutModel((0, _generateDefaults.default)(schema));
}

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
        key: "getSalesforceLink",
        value: function getSalesforceLink() {
          return (0, _firstcutRetrieveUrl.getSalesforceLink)(this);
        }
      }, {
        key: "getLatestEvent",
        value: function getLatestEvent() {
          var events = (0, _actions.eventsInHistory)(this.history);
          return _lodash._.last(events);
        }
      }, {
        key: "createNewRelatedTask",
        value: function createNewRelatedTask() {
          return this.taskService.createNew({
            relatedRecordType: this.modelName,
            relatedRecordId: this._id
          });
        }
      }, {
        key: "getRelatedTasks",
        value: function getRelatedTasks(_ref) {
          var assignedBy = _ref.assignedBy,
              assignedTo = _ref.assignedTo;
          var query = {
            relatedRecordId: this._id
          };

          if (assignedBy) {
            query.assignedById = assignedBy._id;
          }

          if (assignedTo) {
            query.assignedToPlayerId = assignedTo._id;
          }

          return this.taskService.find(query);
        }
      }, {
        key: "appendToHistory",
        value: function appendToHistory(eventData) {
          var self = this.nestedStructuresToImmutables();
          var result = self.addSubobjectToSubarray('history', eventData);
          return result;
        }
      }, {
        key: "getEventsOfType",
        value: function getEventsOfType(eventName) {
          return this.history.toArray().filter(function (event) {
            return event.event === eventName;
          });
        }
      }, {
        key: "getEventId",
        value: function getEventId(eventName) {
          return this._getHistoryField({
            eventName: eventName,
            field: 'event_id'
          });
        }
      }, {
        key: "_getHistoryField",
        value: function _getHistoryField(_ref2) {
          var eventName = _ref2.eventName,
              field = _ref2.field;
          var events = this.getEventsOfType(eventName);

          var withField = _lodash._.first(events.filter(function (event) {
            return event[field] != null;
          }));

          return withField ? withField[field] : null;
        }
      }, {
        key: "blueprintLabel",
        get: function get() {
          return this.blueprint && this.constructor.availableBlueprints[this.blueprint] ? this.constructor.availableBlueprints[this.blueprint].label : '';
        }
      }, {
        key: "availableBlueprints",
        get: function get() {
          return this.constructor.availableBlueprints;
        }
      }, {
        key: "invoiceCount",
        get: function get() {
          return this.invoices ? this.invoices.count() : 0;
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
        key: "createdBy",
        get: function get() {
          var recordCreatedEvent = this.historyAsArray.filter(function (e) {
            return e.event === 'record_created';
          });

          if (recordCreatedEvent.length > 0) {
            return recordCreatedEvent[0].initiator_player_id;
          }

          return '';
        }
      }, {
        key: "locationUrl",
        get: function get() {
          return _schema.LocationParser.locationUrl(this);
        }
      }, {
        key: "historyAsArray",
        get: function get() {
          if (!this.history) {
            return [];
          }

          return this.history.asArray ? this.history.asArray() : this.history;
        }
      }, {
        key: "locationDisplayName",
        get: function get() {
          return _schema.LocationParser.locationDisplayName(this);
        }
      }, {
        key: "cityDisplayName",
        get: function get() {
          return _schema.LocationParser.cityDisplayName(this);
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
          return this.adminOwner ? this.adminOwner.displayName : '';
        }
      }, {
        key: "clientOwnerDisplayName",
        get: function get() {
          return this.clientOwner ? this.clientOwner.displayName : '';
        }
      }, {
        key: "adminOwnerSlackHandle",
        get: function get() {
          if (!this.adminOwner) {
            return '';
          }

          return this.adminOwner.slackHandle || this.adminOwner.firstName;
        }
      }, {
        key: "postpoOwnerSlackHandle",
        get: function get() {
          if (!this.postpoOwner) {
            return '';
          }

          return this.postpoOwner.slackHandle || this.postpoOwner.firstName;
        }
      }, {
        key: "postpoOwnerEmail",
        get: function get() {
          return this.postpoOwner ? this.postpoOwner.email : '';
        }
      }, {
        key: "adminOwnerEmail",
        get: function get() {
          return this.adminOwner ? this.adminOwner.email : '';
        }
      }, {
        key: "clientOwnerEmail",
        get: function get() {
          return this.clientOwner ? this.clientOwner.email : '';
        }
      }, {
        key: "companyDisplayName",
        get: function get() {
          return this.company ? this.company.displayName : '';
        }
      }], [{
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
    }((0, _base.BaseModel)((0, _objectSpread2.default)({}, defaultValues)))
  );
};

var _default = createFirstCutModel;
exports.default = _default;