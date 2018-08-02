"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CutFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _firstcutEnum = require("firstcut-enum");

function CutFactory(Base, schema) {
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
        return this.projectDirectory + 'cuts';
      }
    }, {
      key: "projectDirectory",
      get: function get() {
        if (!this.project) {
          throw new Meteor.Error('requirements-not-fulfilled', 'Project is required in order to upload files for this document');
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
        return _firstcutEnum.CUT_TYPES[this.type];
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
      key: "isSnippet",
      get: function get() {
        return this.type == 'SNIPPET';
      }
    }, {
      key: "hasBrandIntro",
      get: function get() {
        return this.company ? this.company.hasBrandIntro : false;
      }
    }, {
      key: "hasBeenVerified",
      get: function get() {
        return this.eventsInHistory.includes(_firstcutEnum.EVENTS.has_been_sent_to_client);
      }
    }, {
      key: "hasBeenApprovedByClient",
      get: function get() {
        return this.eventsInHistory.includes(_firstcutEnum.EVENTS.cut_approved_by_client);
      }
    }, {
      key: "cutHasBeenSentToClient",
      get: function get() {
        return this.eventsInHistory.includes(_firstcutEnum.EVENTS.send_cut_to_client);
      }
    }, {
      key: "hasVerifiedRevisions",
      get: function get() {
        return this.eventsInHistory.includes(_firstcutEnum.EVENTS.revisions_sent);
      }
    }, {
      key: "clientHasSubmittedFeedback",
      get: function get() {
        return this.eventsInHistory.includes(_firstcutEnum.EVENTS.feedback_submitted_by_client) || this.hasVerifiedRevisions;
      }
    }, {
      key: "clientSubmittedFeedbackEvent",
      get: function get() {
        return _.first(this.getEventsOfType(_firstcutEnum.EVENTS.feedback_submitted_by_client));
      }
    }], [{
      key: "collection_name",
      get: function get() {
        return 'cuts';
      }
    }]);
    return Cut;
  }(Base);

  Cut.schema = schema;
  return Cut;
}