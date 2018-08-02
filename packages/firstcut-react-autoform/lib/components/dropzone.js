"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _immutable = require("immutable");

var _semanticUiReact = require("semantic-ui-react");

var _reactDropzoneComponent = _interopRequireDefault(require("react-dropzone-component"));

var _firstcutFilestore = require("firstcut-filestore");

var _autoformUtils = require("../autoform.utils.js");

function ProgressBar(props) {
  return _react.default.createElement(_semanticUiReact.Progress, {
    percent: props.percent,
    indicating: true
  });
}

var Dropzone =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Dropzone, _React$Component);

  function Dropzone() {
    (0, _classCallCheck2.default)(this, Dropzone);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Dropzone).apply(this, arguments));
  }

  (0, _createClass2.default)(Dropzone, [{
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
  (0, _inherits2.default)(PrivateDropzoneComponent, _React$Component2);

  function PrivateDropzoneComponent() {
    (0, _classCallCheck2.default)(this, PrivateDropzoneComponent);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(PrivateDropzoneComponent).apply(this, arguments));
  }

  (0, _createClass2.default)(PrivateDropzoneComponent, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onFileAdded = _this$props.onFileAdded,
          onFileRemoved = _this$props.onFileRemoved,
          record = _this$props.record,
          in_progress = _this$props.in_progress,
          progress = _this$props.progress,
          label = _this$props.label,
          field_options = (0, _objectWithoutProperties2.default)(_this$props, ["onFileAdded", "onFileRemoved", "record", "in_progress", "progress", "label"]);
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