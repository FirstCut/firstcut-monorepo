"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LoginBox", {
  enumerable: true,
  get: function get() {
    return _LoginBox.default;
  }
});
Object.defineProperty(exports, "RegisterBox", {
  enumerable: true,
  get: function get() {
    return _RegisterBox.default;
  }
});
Object.defineProperty(exports, "ResetPasswordBox", {
  enumerable: true,
  get: function get() {
    return _ResetPasswordBox.default;
  }
});
Object.defineProperty(exports, "ComboBox", {
  enumerable: true,
  get: function get() {
    return _ComboBox.default;
  }
});
Object.defineProperty(exports, "EnrollmentBox", {
  enumerable: true,
  get: function get() {
    return _EnrollmentBox.default;
  }
});
Object.defineProperty(exports, "OAuthButton", {
  enumerable: true,
  get: function get() {
    return _OAuthButton.default;
  }
});
exports.hasUserProfile = void 0;

var _LoginBox = _interopRequireDefault(require("./components/LoginBox"));

var _RegisterBox = _interopRequireDefault(require("./components/RegisterBox"));

var _ResetPasswordBox = _interopRequireDefault(require("./components/ResetPasswordBox"));

var _ComboBox = _interopRequireDefault(require("./components/ComboBox"));

var _EnrollmentBox = _interopRequireDefault(require("./components/EnrollmentBox"));

var _OAuthButton = _interopRequireDefault(require("./components/OAuthButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasUserProfile = new ValidatedMethod({
  name: 'has-user-profile',
  validate: new SimpleSchema({
    playerEmail: String
  }).validator(),
  run: function run(_ref) {
    var playerEmail = _ref.playerEmail;

    if (Meteor.isServer) {
      var user = Accounts.findUserByEmail(playerEmail) != null;

      if (user) {
        return true;
      } else {
        //TODO only supports google services
        return Meteor.users.findOne({
          "services.google.email": playerEmail
        }) != null;
      }
    }
  }
});
exports.hasUserProfile = hasUserProfile;