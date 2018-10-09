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

// import { isUTC } from 'firstcut-utils/datetime';
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
      asIfUtcDate: null
    }, _this.onDateChange = function (value) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          name = _this$props.name,
          timezone = _this$props.timezone;
      var asIfInTimezone = getUtcDateAsIfInTimezone(value, timezone);

      _this.setState({
        asIfUtcDate: value
      });

      onChange(null, {
        name: name,
        value: asIfInTimezone.toDate()
      });
    }, _temp));
  }

  (0, _createClass2.default)(AutoformDatetime, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props2 = this.props,
          value = _this$props2.value,
          timezone = _this$props2.timezone;
      var asIfUtcDate = value ? replaceTimezone(value, timezone, COMPONENT_DEFAULT_TZ) : null;
      this.setState({
        asIfUtcDate: asIfUtcDate
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props3 = this.props,
          onChange = _this$props3.onChange,
          name = _this$props3.name,
          value = _this$props3.value,
          timezone = _this$props3.timezone;
      var asIfUtcDate = this.state.asIfUtcDate;

      if (timezone !== prevProps.timezone) {
        var asIfInTimezone = getUtcDateAsIfInTimezone(asIfUtcDate, timezone);
        onChange(null, {
          name: name,
          value: asIfInTimezone.toDate()
        });
      }

      if (!asIfUtcDate && !prevProps.value && value) {
        var utcDate = value ? replaceTimezone(value, timezone, COMPONENT_DEFAULT_TZ) : null;
        this.setState({
          asIfUtcDate: utcDate
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          onChange = _this$props4.onChange,
          value = _this$props4.value,
          fieldProps = (0, _objectWithoutProperties2.default)(_this$props4, ["onChange", "value"]);
      fieldProps.onChange = this.onDateChange;
      return _react.default.createElement(_semanticUiReact.Form.Input, (0, _extends2.default)({
        control: _reactDatetime.default,
        utc: true
      }, fieldProps, {
        value: this.state.asIfUtcDate
      }));
    }
  }]);
  return AutoformDatetime;
}(_react.default.Component);

exports.default = AutoformDatetime;

function replaceTimezone(date) {
  var old_tz = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : COMPONENT_DEFAULT_TZ;
  var newTimezone = arguments.length > 2 ? arguments[2] : undefined;
  var asMoment = (0, _moment.default)(date);
  var strippedDate = asMoment.tz(old_tz).format('YYYY-MM-DD HH:mm');

  var replaced = _moment.default.tz(strippedDate, newTimezone);

  return replaced;
}

function getUtcDateAsIfInTimezone(value, inTimezone) {
  return replaceTimezone(value, 'Etc/UTC', inTimezone);
}