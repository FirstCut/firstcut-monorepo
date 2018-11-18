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

var _firstcutModelBase = require("firstcut-model-base");

var _request = _interopRequireDefault(require("./request.schema"));

var Base = (0, _firstcutModelBase.createFirstCutModel)(_request.default);

var Request =
/*#__PURE__*/
function (_Base) {
  (0, _inherits2.default)(Request, _Base);

  function Request() {
    (0, _classCallCheck2.default)(this, Request);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Request).apply(this, arguments));
  }

  (0, _createClass2.default)(Request, [{
    key: "displayName",
    get: function get() {
      return "".concat(this.first, " ").concat(this.last, " at ").concat(this.company, " (email: ").concat(this.email, ")");
    }
  }], [{
    key: "collectionName",
    get: function get() {
      return 'landingpagerequests';
    }
  }, {
    key: "schema",
    get: function get() {
      return _request.default;
    }
  }]);
  return Request;
}(Base);

var _default = Request;
exports.default = _default;