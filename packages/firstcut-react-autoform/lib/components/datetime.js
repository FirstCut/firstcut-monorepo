"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _reactDatetime = _interopRequireDefault(require("react-datetime"));

var _moment = _interopRequireDefault(require("moment"));

// import { isUTC } from 'firstcut-utils/datetime.js';
var COMPONENT_DEFAULT_TZ = 'Etc/UTC';

var AutoformDatetime =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(AutoformDatetime, _React$Component);

  function AutoformDatetime() {
    var _getPrototypeOf2;

    var _temp, _this;

    (0, _classCallCheck2.default)(this, AutoformDatetime);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _possibleConstructorReturn2.default)(_this, (_temp = _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(AutoformDatetime)).call.apply(_getPrototypeOf2, [this].concat(args))), _this.state = {
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

  (0, _createClass2.default)(AutoformDatetime, [{
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
          field_props = (0, _objectWithoutProperties2.default)(_this$props, ["onChange", "value"]);
      field_props.onChange = this.onDateChange;
      return _react.default.createElement(_semanticUiReact.Form.Input, (0, _extends2.default)({
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