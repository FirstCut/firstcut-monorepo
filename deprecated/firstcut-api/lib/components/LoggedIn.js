"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _universeI18n = _interopRequireDefault(require("meteor/universe:i18n"));

// instance of translate component in "accounts-ui" namespace
var T = _universeI18n.default.createComponent(_universeI18n.default.createTranslator('accounts-ui'));

var LoggedIn = function LoggedIn() {
  return _react.default.createElement("div", {
    className: "ui large form segment"
  }, _react.default.createElement("h2", {
    className: "ui center aligned dividing header"
  }, _react.default.createElement(T, null, "youre_logged_in")), _react.default.createElement("button", {
    onClick: function onClick() {
      return Meteor.logout();
    },
    className: "ui fluid large primary button"
  }, _react.default.createElement(T, null, "click_to_log_out")));
};

var _default = LoggedIn;
exports.default = _default;