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

var _accountsBase = require("meteor/accounts-base");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ErrorMessages = _interopRequireDefault(require("./ErrorMessages"));

// instance of translate component in "accounts-ui" namespace
var T = _universeI18n.default.createComponent(_universeI18n.default.createTranslator('accounts-ui'));

var EnrollmentBox =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(EnrollmentBox, _React$Component);
  (0, _createClass2.default)(EnrollmentBox, null, [{
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

  function EnrollmentBox(props) {
    var _this;

    (0, _classCallCheck2.default)(this, EnrollmentBox);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(EnrollmentBox).call(this, props));
    _this.state = {
      loading: false,
      error: null,
      emailSent: false,
      password: ''
    };
    _this.handleChange = _this.handleChange.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.handleSubmit = _this.handleSubmit.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.renderErrorMessages = _this.renderErrorMessages.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(EnrollmentBox, [{
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
      var password = this.state.password;

      if (!password) {
        this.setState({
          error: _universeI18n.default.__('accounts-ui', 'you_need_to_provide_password')
        });
        return;
      }

      this.setState({
        loading: true,
        error: null
      });

      _accountsBase.Accounts.resetPassword(this.props.token, password, function (err) {
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
          emailSent: true,
          password: ''
        });

        if (_this2.props.onComplete) {
          _this2.props.onComplete();
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
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
        htmlFor: "your_new_password"
      }, _react.default.createElement(T, null, "your_new_password")), _react.default.createElement("div", {
        className: "ui fluid input"
      }, _react.default.createElement("input", {
        type: "password",
        placeholder: _universeI18n.default.__('accounts-ui', 'password'),
        name: "password",
        required: true,
        onChange: this.handleChange,
        value: this.state.password
      }))), _react.default.createElement("button", {
        type: "submit",
        className: "ui fluid large primary button"
      }, _react.default.createElement(T, null, "save")))), EnrollmentBox.renderErrorMessages());
    }
  }]);
  return EnrollmentBox;
}(_react.default.Component);

EnrollmentBox.propTypes = {
  token: _propTypes.default.string,
  onComplete: _propTypes.default.func
};
var _default = EnrollmentBox;
exports.default = _default;