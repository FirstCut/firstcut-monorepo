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

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = _interopRequireDefault(require("../utils"));

var OAuthButton =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(OAuthButton, _React$Component);

  function OAuthButton(props) {
    var _this;

    (0, _classCallCheck2.default)(this, OAuthButton);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(OAuthButton).call(this, props));

    _this.handleClick = function () {
      _this.setState({
        loading: true
      });

      _utils.default.performOAuthLogin(_this.props.service, function (err) {
        _this.setState({
          loading: false,
          error: err ? err.message : null
        });

        if (!err) {
          _this.props.onLogin();
        }
      });
    };

    _this.state = {
      loading: false,
      error: null
    };
    return _this;
  }

  (0, _createClass2.default)(OAuthButton, [{
    key: "render",
    value: function render() {
      var service = this.props.service; // some meteor -> semantic name mappings for nice styling

      if (service === 'google') {
        service += ' plus';
      }

      if (this.state.error) {
        return _react.default.createElement("button", {
          className: "ui fluid negative disabled button",
          style: {
            marginBottom: 10
          }
        }, _react.default.createElement("i", {
          className: "warning circle icon"
        }), " ", this.state.error);
      }

      if (this.state.loading) {
        return _react.default.createElement("button", {
          className: "ui fluid button ".concat(service, " loading"),
          style: {
            marginBottom: 10
          }
        }, _react.default.createElement("div", null, "loading"));
      }

      return _react.default.createElement("button", {
        className: "ui fluid button ".concat(service),
        style: {
          marginBottom: 10
        },
        onClick: this.handleClick
      }, _react.default.createElement("i", {
        className: "".concat(service, " icon")
      }), " ", this.props.text);
    }
  }]);
  return OAuthButton;
}(_react.default.Component);

OAuthButton.propTypes = {
  service: _propTypes.default.string,
  text: _propTypes.default.string,
  onClick: _propTypes.default.func,
  onLogin: _propTypes.default.func
};
var _default = OAuthButton;
exports.default = _default;