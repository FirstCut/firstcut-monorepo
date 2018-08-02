"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withRecordManager;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _immutable = require("immutable");

var _pubsubJs = require("pubsub-js");

var _ = require("/imports/ui/pages/404.jsx");

function withRecordManager(WrappedComponent) {
  var _class, _temp, _initialiseProps;

  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2.default)(_class, _React$Component);

    function _class(props) {
      var _this;

      (0, _classCallCheck2.default)(this, _class);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).call(this, props));

      _initialiseProps.call((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));

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

    (0, _createClass2.default)(_class, [{
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
          return _react.default.createElement(WrappedComponent, (0, _extends2.default)({
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