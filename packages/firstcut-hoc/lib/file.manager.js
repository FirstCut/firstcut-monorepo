"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withFileManager;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _firstcutModels = require("firstcut-models");

var _pubsubJs = require("pubsub-js");

var _immutable = require("immutable");

var _firstcutS = require("firstcut-s3");

function withFileManager(WrappedComponent) {
  return (
    /*#__PURE__*/
    function (_React$Component) {
      (0, _inherits2.default)(_class2, _React$Component);

      function _class2() {
        var _getPrototypeOf2;

        var _temp, _this;

        (0, _classCallCheck2.default)(this, _class2);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return (0, _possibleConstructorReturn2.default)(_this, (_temp = _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(_class2)).call.apply(_getPrototypeOf2, [this].concat(args))), _this.state = {
          name_to_id: new _immutable.Map(),
          in_progress: false,
          progress: 0,
          docs: []
        }, _this.setToInProgress = function () {
          return _this.setState({
            in_progress: true
          });
        }, _this.setProgress = function (p) {
          return _this.setState({
            progress: p
          });
        }, _this.setToNotInProgress = function () {
          return _this.setState({
            in_progress: false,
            progress: 0
          });
        }, _this.onValueChange = function (new_value) {
          var _this$props = _this.props,
              fieldname = _this$props.fieldname,
              onChange = _this$props.onChange,
              save_event = _this$props.save_event;

          if (onChange) {
            onChange(null, {
              name: fieldname,
              value: new_value
            });
          }

          if (save_event) {
            _pubsubJs.PubSub.publish(save_event);
          }
        }, _this.fileError = function (error) {
          alert(error);

          _this.setToNotInProgress();
        }, _this.fileUploadSuccess = function (file_obj) {
          _this.notifyFileAdded(file_obj);

          var name_to_id = _this.state.name_to_id.set(file_obj.name, file_obj._id);

          _this.setState({
            name_to_id: name_to_id
          });

          _this.setToNotInProgress();
        }, _this.notifyFileAdded = function (file_obj) {
          if (!_this.props.onChange) {
            return;
          }

          var _this$props2 = _this.props,
              record = _this$props2.record,
              fieldname = _this$props2.fieldname;
          var accepts_multiple_files = getAcceptsMultipleFiles(record, fieldname);

          if (accepts_multiple_files) {
            var new_field_value = getFileIds(record, fieldname);
            new_field_value.push(file_obj._id);

            _this.onValueChange(new_field_value);
          } else {
            var previous_id = getFileIds(record, fieldname)[0]; // if (previous_id) {
            //   const store = getFileStore(record, fieldname);
            //   removeFileWithId(previous_id, store);
            // }

            _this.onValueChange(file_obj._id);
          }
        }, _this.onFileRemoved = function (file) {
          var _this$props3 = _this.props,
              record = _this$props3.record,
              fieldname = _this$props3.fieldname;
          var store = getFileStore(record, fieldname);
          var file_id = file._id ? file._id : _this.state.name_to_id.get(file.name); // removeFileWithId(file_id, store);

          _this.notifyFileRemoved(file_id);
        }, _this.notifyFileRemoved = function (file_id) {
          var _this$props4 = _this.props,
              record = _this$props4.record,
              fieldname = _this$props4.fieldname;
          var file_ids = getFileIds(record, fieldname);
          var new_field_value = file_ids.filter(function (id) {
            return id != file_id;
          });

          _this.onValueChange(new_field_value);
        }, _this.onFileAdded = function (file) {
          var _this$props5 = _this.props,
              record = _this$props5.record,
              fieldname = _this$props5.fieldname;
          var file_options = {
            file: file,
            streams: 'dynamic',
            chunkSize: 'dynamic',
            meta: {
              root: record.filesRoot(fieldname),
              bucket: getFileBucket(record, fieldname)
            },
            allowWebWorkers: true
          };

          var result = _firstcutModels.Models.Asset.insert(file_options);

          var emitter = result.emitter;
          emitter.on('error', _this.fileError);
          emitter.on('uploaded', _this.fileUploadSuccess.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), result.record));
          emitter.on('progress', function (progress) {
            _this.setProgress(progress);
          });

          _this.setToInProgress();
        }, _temp));
      }

      (0, _createClass2.default)(_class2, [{
        key: "fetchDocuments",
        value: function () {
          var _fetchDocuments = (0, _asyncToGenerator2.default)(
          /*#__PURE__*/
          _regenerator.default.mark(function _callee(_ref) {
            var fieldname, record, docs;
            return _regenerator.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    fieldname = _ref.fieldname, record = _ref.record;
                    _context.next = 3;
                    return getFileDocuments(record, fieldname);

                  case 3:
                    docs = _context.sent;
                    this.setState({
                      docs: docs
                    });

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          return function fetchDocuments(_x) {
            return _fetchDocuments.apply(this, arguments);
          };
        }()
      }, {
        key: "componentDidMount",
        value: function componentDidMount() {
          this.fetchDocuments(this.props);
        }
      }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(next_props, props) {
          if (props.fieldname != next_props.fieldname || props.record != next_props.record) {
            return true;
          }

          return false;
        }
      }, {
        key: "render",
        value: function render() {
          var _this$props6 = this.props,
              record = _this$props6.record,
              fieldname = _this$props6.fieldname;
          return _react.default.createElement(WrappedComponent, (0, _extends2.default)({
            onFileAdded: this.onFileAdded,
            onFileRemoved: this.onFileRemoved,
            files: this.state.docs,
            progress: this.state.progress,
            in_progress: this.state.in_progress
          }, this.props));
        }
      }]);
      return _class2;
    }(_react.default.Component)
  );
}

function getFileDocuments(record, fieldname) {
  var store = getFileStore(record, fieldname);
  var ids = getFileIds(record, fieldname);
  console.log(ids);
  var promises = ids.map(
  /*#__PURE__*/
  function () {
    var _ref2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2(id) {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", new _promise.default(function (resolve, reject) {
                // getSignedCookies.call({file_ref:f}, (err, result) => {
                //   cookies.set('CloudFront-Key-Pair-Id', result['CloudFront-Key-Pair-Id']);
                //   cookies.set('CloudFront-Policy', result['CloudFront-Policy']);
                //   cookies.set('CloudFront-Signature', result['CloudFront-Signature']);
                // });
                _firstcutS.getSignedUrl.call({
                  file_id: id,
                  version: record.fileVersion
                }, function (err, url) {
                  if (err) {
                    console.log(err);
                    reject(err);
                  } else {
                    var file = _firstcutModels.Models.Asset.fromId(id);

                    file.url = url;
                    console.log(file);
                    resolve(file);
                  }
                });
              }));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  return _promise.default.all(promises);
}

function removeFileWithId(id, store) {
  store.remove.call(id, function (err, res) {
    if (err) {
      alert(err);
    }
  });
}

function isFileField(record, fieldname) {
  var fieldtype = getFieldCustomType(record, fieldname);
  return fieldtype == 'fileArray' || fieldtype == 'file';
}

function getAcceptsMultipleFiles(record, fieldname) {
  var fieldtype = getFieldCustomType(record, fieldname);
  return fieldtype == 'fileArray';
}

function getFileStore(record, fieldname) {
  return _firstcutModels.Models.Asset;
}

function getFileBucket(record, fieldname) {
  var schema_bucket = record.schema.getFieldSchema(fieldname).bucket;
  return schema_bucket ? schema_bucket : Meteor.settings.public.s3.assets_bucket;
}

function getFieldCustomType(record, fieldname) {
  return record.schema.getFieldSchema(fieldname).customType;
}

function getFileIds(record, fieldname) {
  var fieldvalue = record[fieldname];

  if (fieldvalue instanceof _immutable.List) {
    return fieldvalue.toArray();
  } else if (!fieldvalue) {
    return [];
  } else if (fieldvalue instanceof Array) {
    return fieldvalue;
  } else if (typeof fieldvalue == 'string') {
    return [record[fieldname]];
  } else {
    throw new Meteor.Error('invalid-params', 'FileManager requires array, list, or string field');
  }
}