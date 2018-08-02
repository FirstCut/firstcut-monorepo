"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _react = _interopRequireDefault(require("react"));

var _universeI18n = _interopRequireDefault(require("meteor/universe:i18n"));

var _meteor = require("meteor/meteor");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactMeteorData = require("meteor/react-meteor-data");

var _ErrorMessages = _interopRequireDefault(require("./ErrorMessages"));

var _LoginForm = _interopRequireDefault(require("./LoginForm"));

var _LoggedIn = _interopRequireDefault(require("./LoggedIn"));

var _utils = _interopRequireDefault(require("../utils"));

// instance of translate component in "accounts-ui" namespace
var T = _universeI18n.default.createComponent(_universeI18n.default.createTranslator('accounts-ui'));

var LoginBox =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(LoginBox, _React$Component);
  (0, _createClass2.default)(LoginBox, null, [{
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

  function LoginBox(props) {
    var _this;

    (0, _classCallCheck2.default)(this, LoginBox);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(LoginBox).call(this, props));
    _this.state = {
      errors: []
    };
    LoginBox.renderErrorMessages = LoginBox.renderErrorMessages.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(LoginBox, [{
    key: "render",
    value: function render() {
      if (this.props.user) {
        return _react.default.createElement(_LoggedIn.default, null);
      }

      return _react.default.createElement("div", null, _react.default.createElement("div", {
        className: "ui large top attached segment"
      }, _react.default.createElement("h2", {
        className: "ui center aligned dividing header"
      }, _react.default.createElement(T, null, "sign_in")), _react.default.createElement(_LoginForm.default, {
        onError: _utils.default.onError.bind(this),
        clearErrors: _utils.default.clearErrors.bind(this),
        onLogin: this.props.onLogin,
        player_email: this.props.player_email
      })), this.props.onClickRegister || this.props.resetLink ? _react.default.createElement("div", {
        className: "ui large bottom attached info icon message"
      }, _react.default.createElement("i", {
        className: "user icon"
      }), _react.default.createElement("div", {
        className: "content"
      }, _react.default.createElement("div", {
        className: "ui list"
      }, this.props.onClickRegister ? _react.default.createElement("div", {
        className: "item"
      }, _react.default.createElement(T, null, "dont_have_an_account"), _react.default.createElement("a", {
        onClick: this.props.onClickRegister
      }, _react.default.createElement(T, null, "register_here"))) : '', this.props.resetLink ? _react.default.createElement("div", {
        className: "item"
      }, _react.default.createElement(T, null, "forgot_your_password"), _react.default.createElement("a", {
        href: this.props.resetLink
      }, _react.default.createElement(T, null, "click_to_reset"))) : ''))) : '', LoginBox.renderErrorMessages());
    }
  }]);
  return LoginBox;
}(_react.default.Component);

LoginBox.propTypes = {
  onClickRegister: _propTypes.default.func,
  player_email: _propTypes.default.string,
  onLogin: _propTypes.default.func,
  resetLink: _propTypes.default.string,
  user: _propTypes.default.shape({
    _id: _propTypes.default.string
  })
};

var _default = (0, _reactMeteorData.withTracker)(function () {
  return {
    user: _meteor.Meteor.users.findOne()
  };
})(LoginBox);

exports.default = _default;