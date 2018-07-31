"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ClientFactory;

var _firstcutUtils = require("firstcut-utils");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ClientFactory(Base, schema) {
  var Client =
  /*#__PURE__*/
  function (_Base) {
    _inherits(Client, _Base);

    function Client(props) {
      var _this;

      _classCallCheck(this, Client);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Client).call(this, props));

      _firstcutUtils.hasUserProfile.call({
        playerEmail: _this.email
      }, function (err, has_profile) {
        _this.hasUserProfile = has_profile;
      });

      return _this;
    }

    _createClass(Client, [{
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
      key: "hasUserProfile",
      get: function get() {
        return this._has_profile;
      },
      set: function set(has) {
        this._has_profile = has;
      }
    }, {
      key: "company",
      get: function get() {
        return this.companyService.fromId(this.companyId);
      }
    }, {
      key: "companyDisplayName",
      get: function get() {
        return this.company ? this.company.displayName : "";
      }
    }], [{
      key: "collection_name",
      get: function get() {
        return 'clients';
      }
    }]);

    return Client;
  }(Base);

  Client.schema = schema;
  return Client;
}