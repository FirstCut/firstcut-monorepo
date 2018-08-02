"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ClientFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _firstcutUtils = require("firstcut-utils");

function ClientFactory(Base, schema) {
  var Client =
  /*#__PURE__*/
  function (_Base) {
    (0, _inherits2.default)(Client, _Base);

    function Client(props) {
      var _this;

      (0, _classCallCheck2.default)(this, Client);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Client).call(this, props));

      _firstcutUtils.hasUserProfile.call({
        playerEmail: _this.email
      }, function (err, has_profile) {
        _this.hasUserProfile = has_profile;
      });

      return _this;
    }

    (0, _createClass2.default)(Client, [{
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