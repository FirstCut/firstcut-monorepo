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

var _moment = _interopRequireDefault(require("moment"));

var _task = _interopRequireDefault(require("./task.schema"));

var _firstcutModelBase = require("firstcut-model-base");

var _tasks = require("./tasks.enum");

var Base = (0, _firstcutModelBase.createFirstCutModel)(_task.default);

var Task =
/*#__PURE__*/
function (_Base) {
  (0, _inherits2.default)(Task, _Base);

  function Task() {
    (0, _classCallCheck2.default)(this, Task);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Task).apply(this, arguments));
  }

  (0, _createClass2.default)(Task, [{
    key: "getRelatedRecordDisplayName",
    value: function getRelatedRecordDisplayName() {
      var record = this.getRelatedRecord();
      return record ? record.displayName : '';
    }
  }, {
    key: "getRelatedRecord",
    value: function getRelatedRecord() {
      if (!this.relatedRecordType || !this.relatedRecordId) {
        return null;
      }

      return this.getServiceOfType(this.relatedRecordType).fromId(this.relatedRecordId);
    }
  }, {
    key: "getDescription",
    value: function getDescription() {
      return this.description;
    }
  }, {
    key: "getDueDate",
    value: function getDueDate() {
      return this.dateDue;
    }
  }, {
    key: "isPastDue",
    value: function isPastDue() {
      var due = (0, _moment.default)(this.getDueDate());
      var now = (0, _moment.default)();
      return now.isAfter(due);
    }
  }, {
    key: "isUpcoming",
    value: function isUpcoming() {
      // is within 24hrs
      var tomorrow = (0, _moment.default)().add(_tasks.UPCOMING_THRESHOLD_IN_HOURS, 'hour');
      var due = (0, _moment.default)(this.getDueDate());
      return due.isBefore(tomorrow);
    }
  }, {
    key: "displayName",
    get: function get() {
      return this.getDescription();
    }
  }], [{
    key: "createNew",
    value: function createNew(props) {
      if (Meteor.isClient) {
        return new this((0, _objectSpread2.default)({
          assignedToPlayerId: userPlayerId(),
          assignedByPlayerId: userPlayerId(),
          assignedToPlayerType: 'Collaborator'
        }, props));
      }

      return new this((0, _objectSpread2.default)({}, props));
    }
  }, {
    key: "collectionName",
    get: function get() {
      return 'tasks';
    }
  }, {
    key: "schema",
    get: function get() {
      return _task.default;
    }
  }]);
  return Task;
}(Base);

var _default = Task;
exports.default = _default;