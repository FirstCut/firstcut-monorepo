"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CompanyFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

function CompanyFactory(Base, schema) {
  var Company =
  /*#__PURE__*/
  function (_Base) {
    (0, _inherits2.default)(Company, _Base);

    function Company() {
      (0, _classCallCheck2.default)(this, Company);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Company).apply(this, arguments));
    }

    (0, _createClass2.default)(Company, [{
      key: "filesRoot",
      value: function filesRoot(field) {
        return "branding/".concat(this.displayName, "_").concat(this._id);
      }
    }, {
      key: "hasBrandIntro",
      get: function get() {
        return this.brandIntroId != null;
      }
    }, {
      key: "displayName",
      get: function get() {
        return "".concat(this.name);
      }
    }], [{
      key: "collection_name",
      get: function get() {
        return 'companies';
      }
    }]);
    return Company;
  }(Base);

  Company.schema = schema;
  return Company;
}