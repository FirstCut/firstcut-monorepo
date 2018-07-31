"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sparkpost = _interopRequireDefault(require("sparkpost"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FROM_DOMAIN = 'email@firstcut.io';
var API_KEY = Meteor.settings.email.api_key;

var Mailer =
/*#__PURE__*/
function () {
  function Mailer() {
    _classCallCheck(this, Mailer);

    this.client = new _sparkpost.default(API_KEY);
  }

  _createClass(Mailer, [{
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