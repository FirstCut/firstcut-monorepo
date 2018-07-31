"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _universeI18n = _interopRequireDefault(require("meteor/universe:i18n"));

var _accountsBase = require("meteor/accounts-base");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ErrorMessages = _interopRequireDefault(require("./ErrorMessages"));

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

var EnrollmentBox =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EnrollmentBox, _React$Component);

  _createClass(EnrollmentBox, null, [{
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

    _classCallCheck(this, EnrollmentBox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EnrollmentBox).call(this, props));
    _this.state = {
      loading: false,
      error: null,
      emailSent: false,
      password: ''
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderErrorMessages = _this.renderErrorMessages.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(EnrollmentBox, [{
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