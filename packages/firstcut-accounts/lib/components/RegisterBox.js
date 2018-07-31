"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _universeI18n = _interopRequireDefault(require("meteor/universe:i18n"));

var _meteor = require("meteor/meteor");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactMeteorData = require("meteor/react-meteor-data");

var _ErrorMessages = _interopRequireDefault(require("./ErrorMessages"));

var _RegisterForm = _interopRequireDefault(require("./RegisterForm"));

var _LoggedIn = _interopRequireDefault(require("./LoggedIn"));

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

// instance of translate component in "accounts-ui" namespace
var T = _universeI18n.default.createComponent(_universeI18n.default.createTranslator('accounts-ui'));

var RegisterBox =
/*#__PURE__*/
function (_React$Component) {
  _inherits(RegisterBox, _React$Component);

  _createClass(RegisterBox, null, [{
    key: "renderErrorMessages",
    value: function renderErrorMessages() {
      if (this.state.errors.length > 0) {
        return _react.default.createElement(_ErrorMessages.default, {
          errors: this.state.errors
        });
      }

      return _react.default.createElement("div", null);
    }
  }]);

  function RegisterBox(props) {
    var _this;

    _classCallCheck(this, RegisterBox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RegisterBox).call(this, props));
    _this.state = {
      errors: []
    };
    RegisterBox.renderErrorMessages = RegisterBox.renderErrorMessages.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(RegisterBox, [{
    key: "render",
    value: function render() {
      if (this.props.user) {
        return _react.default.createElement(_LoggedIn.default, null);
      }

      return _react.default.createElement("div", null, _react.default.createElement("div", {
        className: "ui large top attached segment"
      }, _react.default.createElement("h2", {
        className: "ui center aligned dividing header"
      }, _react.default.createElement(T, null, "sign_up")), RegisterBox.renderErrorMessages(), _react.default.createElement(_RegisterForm.default, {
        onError: _utils.default.onError.bind(this),
        clearErrors: _utils.default.clearErrors.bind(this),
        onLogin: this.props.onLogin,
        player_email: this.props.player_email
      })), this.props.onClickLogin ? _react.default.createElement("div", {
        className: "ui large bottom attached info icon message"
      }, _react.default.createElement("i", {
        className: "user icon"
      }), _react.default.createElement(T, null, "already_have_an_account"), _react.default.createElement("a", {
        onClick: this.props.onClickLogin
      }, "\xA0", _react.default.createElement(T, null, "click_to_login"))) : '');
    }
  }]);

  return RegisterBox;
}(_react.default.Component);

RegisterBox.propTypes = {
  onClickLogin: _propTypes.default.func,
  player_email: _propTypes.default.string,
  onLogin: _propTypes.default.func,
  user: _propTypes.default.shape({
    _id: _propTypes.default.string
  })
};

var _default = (0, _reactMeteorData.withTracker)(function () {
  return {
    user: _meteor.Meteor.users.findOne()
  };
})(RegisterBox);

exports.default = _default;