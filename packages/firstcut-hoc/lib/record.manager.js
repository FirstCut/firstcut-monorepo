"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withRecordManager;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _immutable = require("immutable");

var _pubsubJs = require("pubsub-js");

var _ = require("/imports/ui/pages/404.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function withRecordManager(WrappedComponent) {
  var _class, _temp, _initialiseProps;

  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));

      _initialiseProps.call(_assertThisInitialized(_assertThisInitialized(_this)));

      var save_subscription = _pubsubJs.PubSub.subscribe(props.save_event, _this.saveRecord);

      var change_subscription = _pubsubJs.PubSub.subscribe(props.change_event, _this.onChange);

      var record = _this.props.seed_record;

      if (record.nestedStructuresToImmutables) {
        record = record.nestedStructuresToImmutables();
      }

      _this.state = {
        record: record,
        validation_errors: {},
        save_subscription: save_subscription,
        change_subscription: change_subscription
      };
      return _this;
    }

    _createClass(_class, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        _pubsubJs.PubSub.unsubscribe(this.state.change_subscription);

        _pubsubJs.PubSub.unsubscribe(this.state.save_subscription);
      }
    }, {
      key: "render",
      value: function render() {
        if (!this.state.record) {
          return _react.default.createElement(_.NotFound, null);
        } else {
          return _react.default.createElement(WrappedComponent, _extends({
            onChange: this.onChange,
            record: this.state.record,
            errors: this.state.validation_errors
          }, this.props));
        }
      }
    }]);

    return _class;
  }(_react.default.Component), _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.onChange = function (e) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          name = _ref.name,
          value = _ref.value;

      _this2.setState(function (prevState, props) {
        var record = prevState.record.set(name, value);
        return {
          record: record
        };
      });
    };

    this.saveRecord = function () {
      var record = _this2.state.record;

      if (record.save) {
        var promise = record.save();
        promise.then(function (saved_record) {
          _this2._handleSaveSuccess(saved_record);
        });
        promise.catch(_this2._handleErrors);
      } else if (record.schema && record.schema.validate) {
        try {
          record.schema.validate(record.toJS());

          _this2._handleSaveSuccess(record);
        } catch (err) {
          _this2._handleErrors(err);
        }
      }
    };

    this._handleSaveSuccess = function (record) {
      _this2.setState(function (prevState, props) {
        var record = prevState.record;

        if (_this2.props.onSaveSuccess) {
          _this2.props.onSaveSuccess(record);
        }

        return {
          validation_errors: {},
          record: record
        };
      });
    };

    this._handleErrors = function (err) {
      _this2.setState(function (prevState, props) {
        var record = prevState.record;

        if (_this2.props.onSaveError) {
          _this2.props.onSaveError(err);
        }

        if (err.error === 'validation-error') {
          var errors = createNameToErrorMap(err);
          return {
            validation_errors: errors
          };
        }
      });
    };
  }, _temp;
}

function createNameToErrorMap(err) {
  var errors = {};
  err.details.forEach(function (fieldError) {
    var name = fieldError.name;

    if (!errors[name]) {
      errors[name] = [];
    }

    errors[name].push(fieldError.message);
  });
  return errors;
}