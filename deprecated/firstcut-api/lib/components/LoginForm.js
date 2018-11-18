"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _universeI18n = _interopRequireDefault(require("meteor/universe:i18n"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = _interopRequireDefault(require("../utils"));

var _OAuthButton = _interopRequireDefault(require("./OAuthButton"));

var _PasswordForm = _interopRequireDefault(require("./PasswordForm"));

// instance of translate component in "accounts-ui" namespace
var T = _universeI18n.default.createComponent(_universeI18n.default.createTranslator('accounts-ui'));

var LoginForm = function LoginForm(_ref) {
  var clearErrors = _ref.clearErrors,
      onError = _ref.onError,
      onLogin = _ref.onLogin,
      player_email = _ref.player_email;

  var services = _utils.default.getServiceNames(); // `Sign in with ${utils.capitalize(service)}`


  return _react.default.createElement("div", {
    className: "ui form"
  }, _react.default.createElement("div", null, services.map(function (service) {
    return _react.default.createElement(_OAuthButton.default, {
      service: service,
      text: "".concat(_universeI18n.default.__('accounts-ui', 'sign_in_with'), " ").concat(_utils.default.capitalize(service)),
      key: service,
      onLogin: onLogin
    });
  })), services.length > 0 && _utils.default.hasPasswordService() ? _react.default.createElement("div", {
    className: "ui horizontal divider"
  }, _react.default.createElement(T, null, "sign_in_with_email")) : '', _utils.default.hasPasswordService() ? _react.default.createElement(_PasswordForm.default, {
    type: "login",
    onError: onError,
    onLogin: onLogin,
    clearErrors: clearErrors,
    player_email: player_email
  }) : '');
};

LoginForm.propTypes = {
  clearErrors: _propTypes.default.func,
  onError: _propTypes.default.func,
  onLogin: _propTypes.default.func,
  player_email: _propTypes.default.string
};
var _default = LoginForm;
exports.default = _default;