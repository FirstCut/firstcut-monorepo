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

var _accountsBase = require("meteor/accounts-base");

var _reactMeteorData = require("meteor/react-meteor-data");

var _ErrorMessages = _interopRequireDefault(require("./ErrorMessages"));

var _LoggedIn = _interopRequireDefault(require("./LoggedIn"));

// instance of translate component in "accounts-ui" namespace
var T = _universeI18n.default.createComponent(_universeI18n.default.createTranslator('accounts-ui'));

var ResetPasswordBox =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ResetPasswordBox, _React$Component);
  (0, _createClass2.default)(ResetPasswordBox, null, [{
    key: "renderErrorMessages",
    value: function renderErrorMessages() {
      if (this.state.errors) {
        return _react.default.createElement(_ErrorMessages.default, {
          errors: this.state.errors
        });
      }

      return _react.default.createElement("div", null);
    }
  }]);

  function ResetPasswordBox(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ResetPasswordBox);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ResetPasswordBox).call(this, props));
    _this.state = {
      loading: false,
      error: null,
      emailSent: false,
      email: ''
    };
    ResetPasswordBox.renderErrorMessages = ResetPasswordBox.renderErrorMessages.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.handleChange = _this.handleChange.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.handleSubmit = _this.handleSubmit.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(ResetPasswordBox, [{
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
      var email = this.state.email;

      if (!email) {
        this.setState({
          error: _universeI18n.default.__('accounts-ui', 'you_need_to_provide_email')
        });
        return;
      }

      this.setState({
        loading: true,
        error: null
      });

      _accountsBase.Accounts.forgotPassword({
        email: email
      }, function (err) {
        if (err) {
          _this2.setState({
            error: err.reason || err.message,
            loading: false
          });

          return;
        }

        _this2.setState({
          error: null,
          loading: false,
          emailSent: true
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.user) {
        return _react.default.createElement(_LoggedIn.default, null);
      }

      if (this.state.emailSent) {
        return _react.default.createElement("div", {
          className: "ui large top attached segment"
        }, _react.default.createElement("h2", {
          className: "ui center aligned dividing header"
        }, _react.default.createElement(T, null, "email_sent")), _react.default.createElement(T, null, "check_your_inbox_for_further_instructions"));
      }

      return _react.default.createElement("div", null, _react.default.createElement("div", {
        className: "ui large top attached segment"
      }, _react.default.createElement("h2", {
        className: "ui center aligned dividing header"
      }, _react.default.createElement(T, null, "reset_password")), _react.default.createElement("form", {
        onSubmit: this.handleSubmit,
        className: "ui form".concat(this.state.loading ? ' loading' : '')
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
      }))), _react.default.createElement("button", {
        type: "submit",
        className: "ui fluid large primary button"
      }, _react.default.createElement(T, null, "send_reset_link")))), this.props.registerLink ? _react.default.createElement("div", {
        className: "ui large bottom attached info icon message"
      }, _react.default.createElement("i", {
        className: "user icon"
      }), _react.default.createElement(T, null, "dont_have_an_account"), _react.default.createElement("a", {
        href: this.props.registerLink
      }, _react.default.createElement(T, null, "register_here"))) : '', ResetPasswordBox.renderErrorMessages());
    }
  }]);
  return ResetPasswordBox;
}(_react.default.Component);

ResetPasswordBox.propTypes = {
  registerLink: _propTypes.default.string,
  user: _propTypes.default.shape({
    _id: _propTypes.default.string
  })
};

var _default = (0, _reactMeteorData.withTracker)(function () {
  return {
    user: _meteor.Meteor.users.findOne()
  };
})(ResetPasswordBox);

exports.default = _default;