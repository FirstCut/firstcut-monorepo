"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DeliverableFactory;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _firstcutEnum = require("firstcut-enum");

var _firstcutBlueprints = require("firstcut-blueprints");

var _lodash = require("lodash");

var _immutable = require("immutable");

function DeliverableFactory(Base, schema) {
  var Deliverable =
  /*#__PURE__*/
  function (_Base) {
    (0, _inherits2.default)(Deliverable, _Base);

    function Deliverable() {
      (0, _classCallCheck2.default)(this, Deliverable);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Deliverable).apply(this, arguments));
    }

    (0, _createClass2.default)(Deliverable, [{
      key: "newInvoice",
      value: function newInvoice() {
        return this.invoiceService.createNew({
          gigId: this._id,
          type: 'DELIVERABLE'
        });
      }
    }, {
      key: "generateDependentRecords",
      value: function generateDependentRecords() {
        if (!this.postpoOwnerId) {
          return [];
        }

        var invoice = this.newInvoice();
        invoice = invoice.set('payeeId', this.postpoOwnerId);
        return [invoice];
      }
    }, {
      key: "filesRoot",
      value: function filesRoot(field) {
        return this.projectDirectory + 'deliverable_assets';
      }
    }, {
      key: "displayName",
      get: function get() {
        return "".concat(this.projectDisplayName, " ").concat(this.name || '', " - ").concat(this.blueprintLabel);
      }
    }, {
      key: "project",
      get: function get() {
        return this.projectService.fromId(this.projectId);
      }
    }, {
      key: "company",
      get: function get() {
        return this.project ? this.project.company : null;
      }
    }, {
      key: "adminOwner",
      get: function get() {
        return this.project ? this.project.adminOwner : null;
      }
    }, {
      key: "clientOwner",
      get: function get() {
        return this.clientService.fromId(this.clientOwnerId);
      }
    }, {
      key: "postpoOwner",
      get: function get() {
        return this.collaboratorService.fromId(this.postpoOwnerId);
      }
    }, {
      key: "projectDirectory",
      get: function get() {
        return this.project ? this.project.projectDirectory : '';
      }
    }, {
      key: "adminOwnerSlackHandle",
      get: function get() {
        return this.adminOwner ? this.adminOwner.slackHandle : '';
      }
    }, {
      key: "postpoOwnerSlackHandle",
      get: function get() {
        return this.postpoOwner ? this.postpoOwner.slackHandle : '';
      }
    }, {
      key: "adminOwnerFirstName",
      get: function get() {
        return this.adminOwner ? this.adminOwner.firstName : '';
      }
    }, {
      key: "postpoOwnerFirstName",
      get: function get() {
        return this.postpoOwner ? this.postpoOwner.firstName : '';
      }
    }, {
      key: "adminOwnerDisplayName",
      get: function get() {
        return this.adminOwner ? this.adminOwner.displayName : '';
      }
    }, {
      key: "postpoOwnerDisplayName",
      get: function get() {
        return this.postpoOwner ? this.postpoOwner.displayName : '';
      }
    }, {
      key: "cuts",
      get: function get() {
        return this.cutService.find({
          deliverableId: this._id
        });
      }
    }, {
      key: "latestCut",
      get: function get() {
        var sorted = _lodash._.sortBy(this.cuts.toArray(), ['createdAt']);

        return _lodash._.last(sorted);
      }
    }, {
      key: "hasBeenKickedOff",
      get: function get() {
        return this.eventsInHistory.includes('deliverable_kickoff');
      }
    }, {
      key: "entireHistory",
      get: function get() {
        var cut_history = this.cuts.toArray().map(function (cut) {
          return cut.history.map(function (event) {
            if (event.toJS) {
              event = event.toJS();
            }

            event.title = _firstcutEnum.EVENT_LABELS[event.event] + " -- " + cut.versionDisplayName;
            return event;
          });
        });

        var all_events = _lodash._.flatten(cut_history);

        all_events = (0, _toConsumableArray2.default)(this.history.toArray()).concat((0, _toConsumableArray2.default)(_lodash._.flatten(cut_history)));

        var sorted = _lodash._.sortBy(all_events, ['timestamp']);

        return new _immutable.List(sorted);
      }
    }], [{
      key: "collection_name",
      get: function get() {
        return 'deliverables';
      }
    }]);
    return Deliverable;
  }(Base);

  Deliverable.schema = schema;
  Deliverable.available_blueprints = _firstcutBlueprints.DELIVERABLE_BLUEPRINTS;
  return Deliverable;
}