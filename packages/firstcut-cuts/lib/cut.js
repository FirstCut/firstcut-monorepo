"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _meteor = require("meteor/meteor");

var _lodash = require("lodash");

var _cuts = require("./cuts.enum");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _cuts2 = _interopRequireDefault(require("./cuts.schema"));

var _firstcutModelBase = require("firstcut-model-base");

var Base = (0, _firstcutModelBase.createFirstCutModel)(_cuts2.default);

var Cut =
/*#__PURE__*/
function (_Base) {
  (0, _inherits2.default)(Cut, _Base);

  function Cut() {
    (0, _classCallCheck2.default)(this, Cut);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Cut).apply(this, arguments));
  }

  (0, _createClass2.default)(Cut, [{
    key: "filesRoot",
    value: function filesRoot(field) {
      return "".concat(this.projectDirectory, "cuts");
    }
  }, {
    key: "getDeliverableName",
    value: function getDeliverableName() {
      return this.deliverable.name || '';
    }
  }, {
    key: "isFullInterview",
    value: function isFullInterview() {
      return this.type === 'FULL_INTERVIEW';
    }
  }, {
    key: "isFirstCut",
    value: function isFirstCut() {
      return this.type === 'FIRST_CUT';
    }
  }, {
    key: "isRevisionsCut",
    value: function isRevisionsCut() {
      return this.type === 'REVISIONS_CUT';
    }
  }, {
    key: "isFinalCut",
    value: function isFinalCut() {
      return this.type === 'FINAL_CUT';
    }
  }, {
    key: "isExtraCut",
    value: function isExtraCut() {
      return this.type === 'EXTRA_CUT';
    }
  }, {
    key: "isSnippet",
    value: function isSnippet() {
      return this.type === 'SNIPPET';
    }
  }, {
    key: "isLatestCut",
    value: function isLatestCut() {
      var latest = this.deliverable.getLatestCut();
      return latest && latest._id === this._id;
    }
  }, {
    key: "deliverableHasApprovedCut",
    value: function deliverableHasApprovedCut() {
      return this.deliverable.approvedCut() != null;
    }
  }, {
    key: "projectDirectory",
    get: function get() {
      if (!this.project) {
        throw new _meteor.Meteor.Error('requirements-not-fulfilled', 'Project is required in order to upload files for this document');
      }

      return this.project.projectDirectory;
    }
  }, {
    key: "hasFile",
    get: function get() {
      return this.fileId || this.fileUrl;
    }
  }, {
    key: "brandIntroId",
    get: function get() {
      return this.company ? this.company.brandIntroId : '';
    }
  }, {
    key: "displayName",
    get: function get() {
      return "".concat(this.deliverableDisplayName, " (").concat(this.typeLabel, ")");
    }
  }, {
    key: "typeLabel",
    get: function get() {
      return _cuts.CUT_TYPES[this.type];
    }
  }, {
    key: "deliverable",
    get: function get() {
      return this.deliverableId ? this.deliverableService.fromId(this.deliverableId) : null;
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
    key: "postpoOwner",
    get: function get() {
      return this.deliverable ? this.deliverable.postpoOwner : null;
    }
  }, {
    key: "adminOwner",
    get: function get() {
      return this.deliverable ? this.deliverable.adminOwner : null;
    }
  }, {
    key: "clientOwner",
    get: function get() {
      return this.deliverable ? this.deliverable.clientOwner : null;
    }
  }, {
    key: "project",
    get: function get() {
      return this.deliverable ? this.deliverable.project : null;
    }
  }, {
    key: "company",
    get: function get() {
      return this.project ? this.project.company : null;
    }
  }, {
    key: "versionDisplayName",
    get: function get() {
      return "v".concat(this.version);
    }
  }, {
    key: "hasBrandIntro",
    get: function get() {
      return this.company ? this.company.hasBrandIntro : false;
    }
  }, {
    key: "hasBeenVerified",
    get: function get() {
      return this.eventsInHistory.includes(_firstcutPipelineConsts.EVENTS.has_been_sent_to_client);
    }
  }, {
    key: "hasBeenApprovedByClient",
    get: function get() {
      return this.eventsInHistory.includes(_firstcutPipelineConsts.EVENTS.cut_approved_by_client);
    }
  }, {
    key: "cutHasBeenSentToClient",
    get: function get() {
      return this.eventsInHistory.includes(_firstcutPipelineConsts.EVENTS.send_cut_to_client);
    }
  }, {
    key: "hasVerifiedRevisions",
    get: function get() {
      return this.eventsInHistory.includes(_firstcutPipelineConsts.EVENTS.revisions_sent);
    }
  }, {
    key: "clientHasSubmittedFeedback",
    get: function get() {
      return this.eventsInHistory.includes(_firstcutPipelineConsts.EVENTS.feedback_submitted_by_client) || this.hasVerifiedRevisions;
    }
  }, {
    key: "clientSubmittedFeedbackEvent",
    get: function get() {
      return _lodash._.first(this.getEventsOfType(_firstcutPipelineConsts.EVENTS.feedback_submitted_by_client));
    }
  }], [{
    key: "collectionName",
    get: function get() {
      return 'cuts';
    }
  }, {
    key: "schema",
    get: function get() {
      return _cuts2.default;
    }
  }]);
  return Cut;
}(Base);

var _default = Cut;
exports.default = _default;