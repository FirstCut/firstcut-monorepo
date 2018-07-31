"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _reactDatetime = _interopRequireDefault(require("react-datetime"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import { isUTC } from 'firstcut-utils/datetime.js';
var COMPONENT_DEFAULT_TZ = 'Etc/UTC';

var AutoformDatetime =
/*#__PURE__*/
function (_React$Component) {
  _inherits(AutoformDatetime, _React$Component);

  function AutoformDatetime() {
    var _getPrototypeOf2;

    var _temp, _this;

    _classCallCheck(this, AutoformDatetime);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AutoformDatetime)).call.apply(_getPrototypeOf2, [this].concat(args))), _this.state = {
      as_if_utc_date: null
    }, _this.onDateChange = function (value) {
      var as_if_in_timezone = _this.getUtcDateAsIfInTimezone(value, _this.props.timezone);

      _this.setState({
        as_if_utc_date: value
      });

      _this.props.onChange(null, {
        name: _this.props.name,
        value: as_if_in_timezone.toDate()
      });
    }, _temp));
  }

  _createClass(AutoformDatetime, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var as_if_utc_date = this.props.value ? replaceTimezone(this.props.value, this.props.timezone, COMPONENT_DEFAULT_TZ) : null;
      this.setState({
        as_if_utc_date: as_if_utc_date
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prev_props, prev_state) {
      if (this.props.timezone != prev_props.timezone) {
        var as_if_in_timezone = this.getUtcDateAsIfInTimezone(this.state.as_if_utc_date, this.props.timezone);
        this.props.onChange(null, {
          name: this.props.name,
          value: as_if_in_timezone.toDate()
        });
      }
    }
  }, {
    key: "getUtcDateAsIfInTimezone",
    value: function getUtcDateAsIfInTimezone(value, in_timezone) {
      return replaceTimezone(value, 'Etc/UTC', in_timezone);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          value = _this$props.value,
          field_props = _objectWithoutProperties(_this$props, ["onChange", "value"]);

      field_props.onChange = this.onDateChange;
      return _react.default.createElement(_semanticUiReact.Form.Input, _extends({
        control: _reactDatetime.default,
        utc: true
      }, field_props, {
        value: this.state.as_if_utc_date
      }));
    }
  }]);

  return AutoformDatetime;
}(_react.default.Component);

exports.default = AutoformDatetime;

var replaceTimezone = function replaceTimezone(date) {
  var old_tz = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : COMPONENT_DEFAULT_TZ;
  var new_tz = arguments.length > 2 ? arguments[2] : undefined;
  var as_moment = (0, _moment.default)(date);
  var stripped_date = as_moment.tz(old_tz).format("YYYY-MM-DD HH:mm");

  var replaced = _moment.default.tz(stripped_date, new_tz);

  return replaced;
};