"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _firstcutUtils = require("firstcut-utils");

var _semanticUiReact = require("semantic-ui-react");

var _immutable = require("immutable");

var _detectBrowser = require("detect-browser");

var _reactDropzone = _interopRequireDefault(require("react-dropzone"));

var browser = (0, _detectBrowser.detect)();

function ProgressBar(props) {
  return _react.default.createElement(_semanticUiReact.Progress, {
    percent: props.percent,
    indicating: true
  });
}

var Drop =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Drop, _React$Component);

  function Drop() {
    (0, _classCallCheck2.default)(this, Drop);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf3.default)(Drop).apply(this, arguments));
  }

  (0, _createClass2.default)(Drop, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return false;
    }
  }, {
    key: "render",
    value: function render() {
      var withFileManager = this.props.withFileManager;
      var Enabled = withFileManager(PrivateDropzoneComponent);
      return _react.default.createElement(Enabled, this.props);
    }
  }]);
  return Drop;
}(_react.default.Component);

var PrivateDropzoneComponent =
/*#__PURE__*/
function (_React$Component2) {
  (0, _inherits2.default)(PrivateDropzoneComponent, _React$Component2);

  function PrivateDropzoneComponent() {
    var _getPrototypeOf2;

    var _temp, _this;

    (0, _classCallCheck2.default)(this, PrivateDropzoneComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _possibleConstructorReturn2.default)(_this, (_temp = _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(PrivateDropzoneComponent)).call.apply(_getPrototypeOf2, [this].concat(args))), _this.state = {
      files: new _immutable.List()
    }, _this.onDrop = function (files) {
      files.forEach(function (f) {
        return _this.handleFile(f);
      });
    }, _this.getDataTransferItems = function (event) {
      var dataTransferItemsList = [];

      if (event.dataTransfer) {
        var dt = event.dataTransfer;

        if (dt.files && dt.files.length) {
          dataTransferItemsList = dt.files;
        }

        if (dt.items && dt.items.length) {
          // During the drag even the dataTransfer.files is null
          // but Chrome implements some drag store, which is accesible via dataTransfer.items
          var items = dt.items;

          for (var i = 0; i < items.length; i++) {
            var entry = items[i].webkitGetAsEntry();

            if (entry) {
              traverseFileTree(entry, '', _this.handleFile);
            }
          }

          dataTransferItemsList = dt.items;
        }
      } else if (event.target && event.target.files) {
        dataTransferItemsList = event.target.files;
      } // Convert from DataTransferItemsList to the native Array


      return Array.prototype.slice.call(dataTransferItemsList);
    }, _this.handleFile = function (f) {
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      f.preview = window.URL.createObjectURL(f);
      var files = _this.state.files;
      var onFileAdded = _this.props.onFileAdded;
      files = files.push(f);

      _this.setState({
        files: files
      });

      onFileAdded(f, path);
    }, _temp));
  }

  (0, _createClass2.default)(PrivateDropzoneComponent, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          fileStats = _this$props.fileStats,
          label = _this$props.label,
          uploadComplete = _this$props.uploadComplete;
      var files = this.state.files; // const drop_props = removeNonDomFields(field_options);

      var dropzoneStyles = {
        textAlign: 'center',
        width: '100%',
        margin: 'auto',
        padding: '10px',
        border: '4px dashed red',
        borderRadius: '10px'
      };

      if (uploadComplete) {
        dropzoneStyles.border = '4px dashed green';
      }

      return _react.default.createElement(_reactDropzone.default, {
        onDrop: this.onDrop,
        getDataTransferItems: this.getDataTransferItems,
        activeClassName: "dragover",
        style: dropzoneStyles
      }, _react.default.createElement(_semanticUiReact.Header, null, ' ', label, ' ', uploadComplete && _react.default.createElement("span", null, "UPLOAD COMPLETE!")), _react.default.createElement(_semanticUiReact.Card.Group, null, files.map(function (f) {
        var _ref = fileStats.get(f.name) || {},
            _ref$progress = _ref.progress,
            progress = _ref$progress === void 0 ? 0 : _ref$progress,
            secondsLeft = _ref.secondsLeft,
            readableSpeed = _ref.readableSpeed;

        if (progress <= 1) {
          progress *= 100;
        }

        return _react.default.createElement(_semanticUiReact.Card, {
          key: f.name,
          color: progress === 100 ? 'green' : 'yellow'
        }, _react.default.createElement(_semanticUiReact.Image, {
          src: f.preview,
          size: "small",
          style: {
            margin: 'auto'
          }
        }), _react.default.createElement(_semanticUiReact.Card.Content, null, _react.default.createElement(_semanticUiReact.Card.Header, null, f.name), _react.default.createElement(_semanticUiReact.Card.Meta, null, (0, _firstcutUtils.formatBytes)(f.size), readableSpeed && _react.default.createElement("b", null, ' ', "Upload speed:", ' ', readableSpeed))), _react.default.createElement(_semanticUiReact.Card.Content, null, _react.default.createElement(ProgressBar, {
          percent: progress,
          label: "Uploading..."
        }), secondsLeft && _react.default.createElement("b", null, ' ', "time remaining:", ' ', humanReadableSeconds(secondsLeft))));
      })));
    }
  }]);
  return PrivateDropzoneComponent;
}(_react.default.Component);

PrivateDropzoneComponent.defaultProps = {
  label: ''
};

function traverseFileTree(item, p, cb) {
  var path = p || '';

  if (item.isFile) {
    // Get file
    item.file(function (file) {
      cb(file, path);
    });
  } else if (item.isDirectory) {
    // Get folder contents
    var dirReader = item.createReader();
    dirReader.readEntries(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        traverseFileTree(entries[i], "".concat(path + item.name, "/"), cb);
      }
    });
  }
} // shamelessly copied from stackoverflow https://stackoverflow.com/questions/8211744/convert-time-interval-given-in-seconds-into-more-human-readable-form


function humanReadableSeconds(seconds) {
  if (!seconds) {
    return 0;
  }

  var numhours = Math.floor(seconds % 31536000 % 86400 / 3600);
  var numminutes = Math.floor(seconds % 31536000 % 86400 % 3600 / 60);
  var numseconds = seconds % 31536000 % 86400 % 3600 % 60;
  return "".concat(numhours, " hours ").concat(numminutes, " minutes ").concat(numseconds, " seconds");
}

PrivateDropzoneComponent.propTypes = {
  onFileAdded: _propTypes.default.func.isRequired,
  progress: _propTypes.default.instanceOf(_immutable.Map),
  label: _propTypes.default.node
};
var _default = Drop;
exports.default = _default;