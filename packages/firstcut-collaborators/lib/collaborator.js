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

var _lodash = require("lodash");

var _collaborators = require("./collaborators.enum");

var _firstcutPipelineConsts = require("firstcut-pipeline-consts");

var _collaborators2 = _interopRequireDefault(require("./collaborators.schema"));

var _firstcutModelBase = require("firstcut-model-base");

var Base = (0, _firstcutModelBase.createFirstCutModel)(_collaborators2.default);

var Collaborator =
/*#__PURE__*/
function (_Base) {
  (0, _inherits2.default)(Collaborator, _Base);

  function Collaborator() {
    (0, _classCallCheck2.default)(this, Collaborator);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Collaborator).apply(this, arguments));
  }

  (0, _createClass2.default)(Collaborator, [{
    key: "hasQualifiedSkill",
    value: function hasQualifiedSkill(skill) {
      var qualifiedSkills = this.skills.filter(function (s) {
        return s.isQualified;
      });
      var skillNames = qualifiedSkills.map(function (s) {
        return s.type;
      });
      return skillNames.includes(skill);
    }
  }, {
    key: "isQualifiedVideographer",
    value: function isQualifiedVideographer() {
      return this.hasQualifiedSkill('CORPORATE_VIDEOGRAPHY');
    }
  }, {
    key: "getSkillLabel",
    value: function getSkillLabel(skill) {
      return _collaborators.COLLABORATOR_SKILLS[skill];
    }
  }, {
    key: "displayName",
    get: function get() {
      return "".concat(this.fullName);
    }
  }, {
    key: "fullName",
    get: function get() {
      return "".concat(this.firstName || '', " ").concat(this.lastName || '');
    }
  }, {
    key: "typeLabel",
    get: function get() {
      return _collaborators.COLLABORATOR_TYPES[this.type];
    }
  }, {
    key: "paymentMethodAsString",
    get: function get() {
      return _lodash._.map(this.paymentMethod, function (method) {
        return "".concat(method.type, ": ").concat(method.accountEmail);
      });
    }
  }, {
    key: "completeRecordAndChildrenHistory",
    get: function get() {
      var _this = this;

      return this.history.map(function (e) {
        var event = e;

        if (event.gig_type && event.gig_id) {
          var gig = _this.models[event.gig_type].fromId(event.gig_id);

          if (!gig) {
            return event;
          }

          var collaboratorLabel = _firstcutPipelineConsts.COLLABORATOR_TYPES_TO_LABELS[event.collaborator_key];
          event.title = "Added to ".concat(gig.displayName, " as a ").concat(collaboratorLabel);
          return event;
        }

        return event;
      });
    }
  }], [{
    key: "getKrizaProfile",
    value: function getKrizaProfile() {
      return this.createNew({
        email: 'kriza@firstcut.io',
        firstName: 'Kriza',
        slackHandle: '<@UBD403R9B>'
      });
    }
  }, {
    key: "getNicoleProfile",
    value: function getNicoleProfile() {
      return this.createNew({
        email: 'nicole@firstcut.io',
        firstName: 'Nicole',
        slackHandle: '<@UCFJTCQGH>'
      });
    }
  }, {
    key: "getRobertProfile",
    value: function getRobertProfile() {
      return this.createNew({
        email: 'robert@firstcut.io',
        firstName: 'Robert',
        slackHandle: '<@U9K0UBP8C>'
      });
    }
  }, {
    key: "getJorgeProfile",
    value: function getJorgeProfile() {
      return this.createNew({
        email: 'jorge@firstcut.io',
        firstName: 'Jorge',
        slackHandle: '<@U40M4TR7S>'
      });
    }
  }, {
    key: "getBillingProfile",
    value: function getBillingProfile() {
      return this.createNew({
        firstName: 'Firstcut Billing',
        email: 'payments@firstcut.io'
      });
    }
  }, {
    key: "collectionName",
    get: function get() {
      return 'players';
    }
  }, {
    key: "schema",
    get: function get() {
      return _collaborators2.default;
    }
  }]);
  return Collaborator;
}(Base);

var _default = Collaborator;
exports.default = _default;