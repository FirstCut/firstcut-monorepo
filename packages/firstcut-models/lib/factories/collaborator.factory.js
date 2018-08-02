"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CollaboratorFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _firstcutEnum = require("firstcut-enum");

function CollaboratorFactory(Base, schema) {
  var Collaborator =
  /*#__PURE__*/
  function (_Base) {
    (0, _inherits2.default)(Collaborator, _Base);

    function Collaborator() {
      (0, _classCallCheck2.default)(this, Collaborator);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Collaborator).apply(this, arguments));
    }

    (0, _createClass2.default)(Collaborator, [{
      key: "getSkillLabel",
      value: function getSkillLabel(skill) {
        return _firstcutEnum.COLLABORATOR_SKILLS[skill];
      }
    }, {
      key: "displayName",
      get: function get() {
        return "".concat(this.fullName);
      }
    }, {
      key: "fullName",
      get: function get() {
        return (this.firstName || "") + " " + (this.lastName || "");
      }
    }, {
      key: "typeLabel",
      get: function get() {
        return _firstcutEnum.COLLABORATOR_TYPES[this.type];
      }
    }, {
      key: "entireHistory",
      get: function get() {
        var _this = this;

        return this.history.map(function (event) {
          if (event.gig_type && event.gig_id) {
            var gig = _this.models[event.gig_type].fromId(event.gig_id);

            if (!gig) {
              return event;
            }

            var collaborator_label = _firstcutEnum.COLLABORATOR_TYPES_TO_LABELS[event.collaborator_key];
            event.title = "Added to ".concat(gig.displayName, " as a ").concat(collaborator_label);
            return event;
          }

          return event;
        });
      }
    }], [{
      key: "collection_name",
      get: function get() {
        return 'players';
      }
    }]);
    return Collaborator;
  }(Base);

  Collaborator.schema = schema;
  return Collaborator;
}