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

var _lodash = require("lodash");

var _conversation = _interopRequireDefault(require("./conversation.schema"));

var Base = (0, _firstcutModelBase.createBaseModel)(_conversation.default);

var Conversation =
/*#__PURE__*/
function (_Base) {
  (0, _inherits2.default)(Conversation, _Base);

  function Conversation() {
    (0, _classCallCheck2.default)(this, Conversation);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Conversation).apply(this, arguments));
  }

  (0, _createClass2.default)(Conversation, [{
    key: "getMessages",
    value: function getMessages() {
      var messages = this.messageService.find({
        conversationId: this._id
      });
      return _lodash._.sort(messages, ['createdAt']);
    }
  }], [{
    key: "collectionName",
    get: function get() {
      return 'conversations';
    }
  }, {
    key: "schema",
    get: function get() {
      return _conversation.default;
    }
  }]);
  return Conversation;
}(Base);

var _default = Conversation;
exports.default = _default;