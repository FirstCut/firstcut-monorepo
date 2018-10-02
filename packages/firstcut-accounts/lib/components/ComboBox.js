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

var _firstcutMeteor = require("firstcut-meteor");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _universeI18n = _interopRequireDefault(require("meteor/universe:i18n"));

var _reactMeteorData = require("meteor/react-meteor-data");

var _ErrorMessages = _interopRequireDefault(require("./ErrorMessages"));

var _LoginForm = _interopRequireDefault(require("./LoginForm"));

var _RegisterForm = _interopRequireDefault(require("./RegisterForm"));

var _LoggedIn = _interopRequireDefault(require("./LoggedIn"));

var _utils = _interopRequireDefault(require("../utils"));

// instance of translate component in "accounts-ui" namespace
var T = _universeI18n.default.createComponent(_universeI18n.default.createTranslator('accounts-ui'));

var RegisterBox =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(RegisterBox, _React$Component);
  (0, _createClass2.default)(RegisterBox, null, [{
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

  function RegisterBox(props) {
    var _this;

    (0, _classCallCheck2.default)(this, RegisterBox);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RegisterBox).call(this, props));
    _this.state = {
      errors: []
    };
    RegisterBox.renderErrorMessages = RegisterBox.renderErrorMessages.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(RegisterBox, [{
    key: "render",
    value: function render() {
      if (this.props.user) {
        return _react.default.createElement(_LoggedIn.default, null);
      }

      return _react.default.createElement("div", null, _react.default.createElement("div", {
        className: "ui large top attached segment"
      }, _react.default.createElement("div", {
        className: "ui two column very relaxed stackable grid"
      }, _react.default.createElement("div", {
        className: "column"
      }, _react.default.createElement("h2", {
        className: "ui center aligned dividing header"
      }, _react.default.createElement(T, null, "sign_in")), _react.default.createElement(_LoginForm.default, {
        onError: _utils.default.onError.bind(this),
        clearErrors: _utils.default.clearErrors.bind(this)
      })), _react.default.createElement("div", {
        className: "ui vertical divider"
      }, _react.default.createElement(T, null, "or")), _react.default.createElement("div", {
        className: "column"
      }, _react.default.createElement("h2", {
        className: "ui center aligned dividing header"
      }, _react.default.createElement(T, null, "sign_up")), _react.default.createElement(_RegisterForm.default, {
        onError: _utils.default.onError.bind(this),
        clearErrors: _utils.default.clearErrors.bind(this)
      })))), this.props.resetLink ? _react.default.createElement("div", {
        className: "ui large bottom attached info icon message"
      }, _react.default.createElement("i", {
        className: "user icon"
      }), _react.default.createElement(T, null, "forgot_your_password"), _react.default.createElement("a", {
        href: this.props.resetLink
      }, "\xA0", _react.default.createElement(T, null, "click_to_reset"))) : '', RegisterBox.renderErrorMessages());
    }
  }]);
  return RegisterBox;
}(_react.default.Component);

RegisterBox.propTypes = {
  resetLink: _propTypes.default.string,
  user: _propTypes.default.shape({
    _id: _propTypes.default.string
  })
};

var _default = (0, _reactMeteorData.withTracker)(function () {
  return {
    user: _firstcutMeteor.Meteor.users.findOne()
  };
})(RegisterBox);

exports.default = _default;