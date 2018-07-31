"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withFileManager;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _firstcutModels = require("firstcut-models");

var _pubsubJs = require("pubsub-js");

var _immutable = require("immutable");

var _firstcutS = require("firstcut-s3");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function withFileManager(WrappedComponent) {
  return (
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(_class2, _React$Component);

      function _class2() {
        var _getPrototypeOf2;

        var _temp, _this;

        _classCallCheck(this, _class2);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_class2)).call.apply(_getPrototypeOf2, [this].concat(args))), _this.state = {
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
          emitter.on('uploaded', _this.fileUploadSuccess.bind(_assertThisInitialized(_assertThisInitialized(_this)), result.record));
          emitter.on('progress', function (progress) {
            _this.setProgress(progress);
          });

          _this.setToInProgress();
        }, _temp));
      }

      _createClass(_class2, [{
        key: "fetchDocuments",
        value: function () {
          var _ref = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(_ref2) {
            var fieldname, record, docs;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    fieldname = _ref2.fieldname, record = _ref2.record;
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

          function fetchDocuments(_x) {
            return _ref.apply(this, arguments);
          }

          return fetchDocuments;
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
          return _react.default.createElement(WrappedComponent, _extends({
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
  var promises = ids.map(function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(id) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", new Promise(function (resolve, reject) {
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
      return _ref3.apply(this, arguments);
    };
  }());
  return Promise.all(promises);
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