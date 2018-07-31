"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CollaboratorFactory;

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

function CollaboratorFactory(Base, schema) {
  var Collaborator =
  /*#__PURE__*/
  function (_Base) {
    _inherits(Collaborator, _Base);

    function Collaborator() {
      _classCallCheck(this, Collaborator);

      return _possibleConstructorReturn(this, _getPrototypeOf(Collaborator).apply(this, arguments));
    }

    _createClass(Collaborator, [{
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