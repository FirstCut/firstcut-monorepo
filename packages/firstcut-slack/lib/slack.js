"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _client = require("@slack/client");

var Slack =
/*#__PURE__*/
function () {
  function Slack(conf) {
    (0, _classCallCheck2.default)(this, Slack);

    if (!conf || !conf.accessToken) {
      throw new Error('slack package requires slack accessToken');
    }

    this.config = conf;
  }

  (0, _createClass2.default)(Slack, [{
    key: "postMessage",
    value: function postMessage(content) {
      var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.config.defaultChannel;
      var accessToken = this.config.accessToken;
      var slack = new _client.WebClient(accessToken);
      console.log(slack);
      var result = (0, _objectSpread2.default)({
        channel: channel
      }, content);
      console.log(result);
      return slack.chat.postMessage(result);
    }
  }]);
  return Slack;
}();

var _default = Slack;
exports.default = _default;