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

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _react = _interopRequireDefault(require("react"));

var _meteor = require("meteor/meteor");

var _universeI18n = _interopRequireDefault(require("meteor/universe:i18n"));

var _accountsBase = require("meteor/accounts-base");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = _interopRequireDefault(require("../utils"));

// instance of translate component in "accounts-ui" namespace
var T = _universeI18n.default.createComponent(_universeI18n.default.createTranslator('accounts-ui'));

var PasswordForm =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(PasswordForm, _React$Component);

  function PasswordForm(props) {
    var _this;

    (0, _classCallCheck2.default)(this, PasswordForm);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(PasswordForm).call(this, props));
    _this.state = {
      loading: false,
      email: _this.props.player_email ? _this.props.player_email : '',
      password: '',
      password2: ''
    };
    _this.handleChange = _this.handleChange.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.handleSubmit = _this.handleSubmit.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(PasswordForm, [{
    key: "handleChange",
    value: function handleChange(e) {
      var newState = {};
      newState[e.target.name] = e.target.value;
      this.setState(newState);
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      var _this2 = this;

      e.preventDefault();
      var _this$props = this.props,
          clearErrors = _this$props.clearErrors,
          onError = _this$props.onError,
          type = _this$props.type,
          onLogin = _this$props.onLogin;
      var _this$state = this.state,
          password = _this$state.password,
          email = _this$state.email;

      if (type === 'login') {
        // log in / sign in
        this.setState({
          loading: true
        });

        _meteor.Meteor.loginWithPassword(email, password, function (err) {
          // let errors = this.state.errors;
          _this2.setState({
            loading: false
          });

          if (err && err.error === 400) {
            onError(_universeI18n.default.__('accounts-ui', 'invalid_usename_or_password'));
          } else if (err) {
            onError(err.reason || _universeI18n.default.__('accounts-ui', 'unknown_error'));
          } else {
            clearErrors();
          }
        });
      } else {
        // register / sign up
        var password2 = this.state.password2;

        if (password !== password2) {
          onError(_universeI18n.default.__('accounts-ui', 'passwords_dont_match'));
          return;
        }

        this.setState({
          loading: true
        });

        _accountsBase.Accounts.createUser({
          email: email,
          password: password // onLogin

        }, function (err) {
          _this2.setState({
            loading: false
          });

          if (err) {
            onError(err.reason || _universeI18n.default.__('accounts-ui', 'unknown_error'));
          } else {
            onLogin();
            clearErrors(); // this.refs.form.reset();
          }
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!_utils.default.hasPasswordService()) {
        return _react.default.createElement("div", null);
      }

      var isRegistration = this.props.type === 'register';
      return _react.default.createElement("form", {
        onSubmit: this.handleSubmit,
        className: "ui large form".concat(this.state.loading ? ' loading' : '')
      }, _react.default.createElement("div", {
        className: "required field"
      }, _react.default.createElement("label", {
        htmlFor: "email"
      }, _react.default.createElement(T, null, "email")), _react.default.createElement("div", {
        className: "ui fluid input"
      }, _react.default.createElement("input", {
        type: "email",
        placeholder: _universeI18n.default.__('accounts-ui', 'email'),
        name: "email",
        required: true,
        onChange: this.handleChange,
        value: this.state.email
      }))), _react.default.createElement("div", {
        className: "required field"
      }, _react.default.createElement("label", {
        htmlFor: "password"
      }, _react.default.createElement(T, null, "password")), _react.default.createElement("input", {
        type: "password",
        placeholder: _universeI18n.default.__('accounts-ui', 'password'),
        name: "password",
        required: true,
        onChange: this.handleChange,
        value: this.state.password
      })), isRegistration ? _react.default.createElement("div", {
        className: "required field"
      }, _react.default.createElement("label", {
        htmlFor: "repeat_password"
      }, _react.default.createElement(T, null, "repeat_password")), _react.default.createElement("input", {
        type: "password",
        placeholder: _universeI18n.default.__('accounts-ui', 'repeat_password'),
        name: "password2",
        required: true,
        onChange: this.handleChange,
        value: this.state.password2
      })) : '', _react.default.createElement("button", {
        type: "submit",
        className: "ui fluid large primary button"
      }, isRegistration ? _universeI18n.default.__('accounts-ui', 'sign_up') : _universeI18n.default.__('accounts-ui', 'sign_in')));
    }
  }]);
  return PasswordForm;
}(_react.default.Component);

PasswordForm.propTypes = {
  clearErrors: _propTypes.default.func,
  onError: _propTypes.default.func,
  onLogin: _propTypes.default.func,
  player_email: _propTypes.default.string,
  type: _propTypes.default.oneOf(['login', 'register']).isRequired
};
var _default = PasswordForm;
exports.default = _default;