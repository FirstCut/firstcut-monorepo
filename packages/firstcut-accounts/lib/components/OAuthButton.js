"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var OAuthButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(OAuthButton, _React$Component);

  function OAuthButton(props) {
    var _this;

    _classCallCheck(this, OAuthButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OAuthButton).call(this, props));

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

  _createClass(OAuthButton, [{
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