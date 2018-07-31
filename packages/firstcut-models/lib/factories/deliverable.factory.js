"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DeliverableFactory;

var _firstcutEnum = require("firstcut-enum");

var _firstcutBlueprints = require("firstcut-blueprints");

var _lodash = require("lodash");

var _immutable = require("immutable");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function DeliverableFactory(Base, schema) {
  var Deliverable =
  /*#__PURE__*/
  function (_Base) {
    _inherits(Deliverable, _Base);

    function Deliverable() {
      _classCallCheck(this, Deliverable);

      return _possibleConstructorReturn(this, _getPrototypeOf(Deliverable).apply(this, arguments));
    }

    _createClass(Deliverable, [{
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

        all_events = _toConsumableArray(this.history.toArray()).concat(_toConsumableArray(_lodash._.flatten(cut_history)));

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