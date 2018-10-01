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

var _clients = _interopRequireDefault(require("./clients.schema"));

var _firstcutModelBase = require("firstcut-model-base");

var Base = (0, _firstcutModelBase.createFirstCutModel)(_clients.default);

var Client =
/*#__PURE__*/
function (_Base) {
  (0, _inherits2.default)(Client, _Base);

  function Client() {
    (0, _classCallCheck2.default)(this, Client);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Client).apply(this, arguments));
  }

  (0, _createClass2.default)(Client, [{
    key: "hasBeenInvitedToPlatform",
    value: function hasBeenInvitedToPlatform() {
      return this.eventsInHistory.includes('send_invite_link');
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
    key: "company",
    get: function get() {
      return this.companyService.fromId(this.companyId);
    }
  }, {
    key: "companyDisplayName",
    get: function get() {
      return this.company ? this.company.displayName : '';
    }
  }], [{
    key: "collectionName",
    get: function get() {
      return 'clients';
    }
  }, {
    key: "schema",
    get: function get() {
      return _clients.default;
    }
  }]);
  return Client;
}(Base);

var _default = Client;
exports.default = _default;