"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _sparkpost = _interopRequireDefault(require("sparkpost"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

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
          addresses = _ref.addresses,
          _ref$substitution_dat = _ref.substitution_data,
          substitution_data = _ref$substitution_dat === void 0 ? {} : _ref$substitution_dat;
      new _simplSchema.default({
        addresses: Array,
        'addresses.$': {
          type: String,
          regEx: _simplSchema.default.RegEx.Email
        }
      }).validate({
        addresses: addresses
      });
      var recipients = addresses.map(function (to) {
        return {
          address: to
        };
      });
      return this._send({
        content: {
          from: FROM_DOMAIN,
          template_id: template
        },
        substitution_data: substitution_data,
        recipients: recipients
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