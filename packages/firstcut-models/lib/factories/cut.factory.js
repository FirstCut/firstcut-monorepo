"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CutFactory;

var _firstcutEnum = require("firstcut-enum");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function CutFactory(Base, schema) {
  var Cut =
  /*#__PURE__*/
  function (_Base) {
    _inherits(Cut, _Base);

    function Cut() {
      _classCallCheck(this, Cut);

      return _possibleConstructorReturn(this, _getPrototypeOf(Cut).apply(this, arguments));
    }

    _createClass(Cut, [{
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