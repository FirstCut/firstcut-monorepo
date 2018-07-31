"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _immutable = require("immutable");

var _semanticUiReact = require("semantic-ui-react");

var _reactDropzoneComponent = _interopRequireDefault(require("react-dropzone-component"));

var _firstcutFilestore = require("firstcut-filestore");

var _autoformUtils = require("../autoform.utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ProgressBar(props) {
  return _react.default.createElement(_semanticUiReact.Progress, {
    percent: props.percent,
    indicating: true
  });
}

var Dropzone =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Dropzone, _React$Component);

  function Dropzone() {
    _classCallCheck(this, Dropzone);

    return _possibleConstructorReturn(this, _getPrototypeOf(Dropzone).apply(this, arguments));
  }

  _createClass(Dropzone, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return false;
    }
  }, {
    key: "render",
    value: function render() {
      var Enabled = (0, _firstcutFilestore.withFileManager)(PrivateDropzoneComponent);
      return _react.default.createElement(Enabled, this.props);
    }
  }]);

  return Dropzone;
}(_react.default.Component);

exports.default = Dropzone;

var PrivateDropzoneComponent =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(PrivateDropzoneComponent, _React$Component2);

  function PrivateDropzoneComponent() {
    _classCallCheck(this, PrivateDropzoneComponent);

    return _possibleConstructorReturn(this, _getPrototypeOf(PrivateDropzoneComponent).apply(this, arguments));
  }

  _createClass(PrivateDropzoneComponent, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onFileAdded = _this$props.onFileAdded,
          onFileRemoved = _this$props.onFileRemoved,
          record = _this$props.record,
          in_progress = _this$props.in_progress,
          progress = _this$props.progress,
          label = _this$props.label,
          field_options = _objectWithoutProperties(_this$props, ["onFileAdded", "onFileRemoved", "record", "in_progress", "progress", "label"]);

      field_options.config = {
        showFiletypeIcon: true,
        postUrl: '/stubUrl'
      };
      field_options.eventHandlers = {
        addedfile: onFileAdded,
        removedfile: onFileRemoved
      };
      field_options.djsConfig = {
        addRemoveLinks: true
      };
      var drop_props = (0, _autoformUtils.removeNonDomFields)(field_options);
      return _react.default.createElement("div", null, in_progress && _react.default.createElement(ProgressBar, {
        percent: progress,
        label: "Uploading..."
      }), _react.default.createElement(_semanticUiReact.Label, null, label), _react.default.createElement(_reactDropzoneComponent.default, field_options));
    }
  }]);

  return PrivateDropzoneComponent;
}(_react.default.Component);