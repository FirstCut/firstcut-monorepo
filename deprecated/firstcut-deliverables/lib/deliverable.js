"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _lodash = require("lodash");

var _immutable = require("immutable");

var _firstcutModelBase = require("firstcut-model-base");

var _deliverables = _interopRequireDefault(require("./deliverables.schema"));

var _deliverables2 = _interopRequireDefault(require("./deliverables.blueprints"));

var Base = (0, _firstcutModelBase.createFirstCutModel)(_deliverables.default);

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
      return "".concat(this.projectDirectory, "deliverable_assets");
    }
  }, {
    key: "isWrapped",
    value: function isWrapped() {
      return this.project.isWrapped();
    }
  }, {
    key: "approvedCut",
    value: function approvedCut() {
      if (!this.approvedCutId) {
        return null;
      }

      return this.cutService.fromId(this.approvedCutId);
    }
  }, {
    key: "hasCutOfType",
    value: function hasCutOfType(cutType) {
      var existingCutTypes = this.getCuts().toArray().map(function (c) {
        return c.type;
      });
      return existingCutTypes.includes(cutType);
    }
  }, {
    key: "getNextCutTypeDue",
    value: function getNextCutTypeDue() {
      var CUT_TYPE_ORDER = ['FIRST_CUT', 'REVISIONS_CUT', 'FINAL_CUT', 'EXTRA_CUT'];
      var latestType = this.getLatestCut() ? this.getLatestCut().type : null;

      if (!latestType) {
        return CUT_TYPE_ORDER[0];
      }

      var latestIndex = CUT_TYPE_ORDER.indexOf(latestType);

      if (latestIndex === CUT_TYPE_ORDER.length - 1) {
        return null;
      }

      return CUT_TYPE_ORDER[latestIndex + 1];
    }
  }, {
    key: "getCuts",
    value: function getCuts() {
      return this.cutService.find({
        deliverableId: this._id
      });
    }
  }, {
    key: "getLatestCut",
    value: function getLatestCut() {
      var sorted = _lodash._.sortBy(this.getCuts().toArray(), ['createdAt']);

      return _lodash._.last(sorted);
    }
  }, {
    key: "hasBeenKickedOff",
    value: function hasBeenKickedOff() {
      return this.eventsInHistory.includes('deliverable_kickoff');
    }
  }, {
    key: "displayName",
    get: function get() {
      return "".concat(this.projectDisplayName, " ").concat(this.name || '');
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
    key: "completeRecordAndChildrenHistory",
    get: function get() {
      var cuts = this.getCuts().toArray();
      var cutHistory = cuts.map(function (cut) {
        return cut.historyAsArray.map(function (event) {
          var e = event;

          if (e.toJS) {
            e = e.toJS();
          }

          e.title = "".concat(_firstcutPipelineConsts.EVENT_LABELS[e.event], " -- ").concat(cut.versionDisplayName);
          return e;
        });
      });

      var allEvents = _lodash._.flatten(cutHistory);

      allEvents = (0, _toConsumableArray2.default)(this.historyAsArray).concat((0, _toConsumableArray2.default)(_lodash._.flatten(cutHistory)));

      var sorted = _lodash._.sortBy(allEvents, ['timestamp']);

      return new _immutable.List(sorted);
    }
  }], [{
    key: "collectionName",
    get: function get() {
      return 'deliverables';
    }
  }, {
    key: "schema",
    get: function get() {
      return _deliverables.default;
    }
  }]);
  return Deliverable;
}(Base);

Deliverable.availableBlueprints = _deliverables2.default;
var _default = Deliverable;
exports.default = _default;