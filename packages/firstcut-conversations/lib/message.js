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

var _message = _interopRequireDefault(require("./message.schema"));

var Base = (0, _firstcutModelBase.createBaseModel)(_message.default);

var Message =
/*#__PURE__*/
function (_Base) {
  (0, _inherits2.default)(Message, _Base);

  function Message() {
    (0, _classCallCheck2.default)(this, Message);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Message).apply(this, arguments));
  }

  (0, _createClass2.default)(Message, null, [{
    key: "collectionName",
    get: function get() {
      return 'messages';
    }
  }, {
    key: "schema",
    get: function get() {
      return _message.default;
    }
  }]);
  return Message;
}(Base);

var _default = Message;
exports.default = _default;