"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _sparkpost = _interopRequireDefault(require("sparkpost"));

var FROM_DOMAIN = 'email@firstcut.io';
var API_KEY = Meteor.settings.email.api_key;

var Mailer =
/*#__PURE__*/
function () {
  function Mailer() {
    (0, _classCallCheck2.default)(this, Mailer);
    this.client = new _sparkpost.default(API_KEY);
  }

  (0, _createClass2.default)(Mailer, [{
    key: "send",
    value: function send(_ref) {
      var template = _ref.template,
          to = _ref.to,
          _ref$cc = _ref.cc,
          cc = _ref$cc === void 0 ? [] : _ref$cc,
          _ref$substitution_dat = _ref.substitution_data,
          substitution_data = _ref$substitution_dat === void 0 ? {} : _ref$substitution_dat;
      var recipients = to.map(function (email) {
        return {
          address: {
            email: email
          }
        };
      });
      var ccRecipients = cc.map(function (email) {
        return {
          address: {
            email: email,
            header_to: to[0]
          }
        };
      });
      var content = {
        from: FROM_DOMAIN,
        template_id: template
      };

      if (cc.length > 0) {
        var headerCC = cc.join(',');
        content.headers = {
          CC: headerCC
        };
      }

      return this._send({
        content: content,
        substitution_data: substitution_data,
        recipients: (0, _toConsumableArray2.default)(recipients).concat((0, _toConsumableArray2.default)(ccRecipients))
      });
    }
  }, {
    key: "_send",
    value: function _send(content) {
      return this.client.transmissions.send(content);
    }
  }]);
  return Mailer;
}();

var _default = Mailer;
exports.default = _default;