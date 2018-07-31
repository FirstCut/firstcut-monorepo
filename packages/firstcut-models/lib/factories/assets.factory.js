"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AssetFactory;

var _sanitizeFilename = _interopRequireDefault(require("sanitize-filename"));

var _meteorRandom = require("meteor-random");

var _firstcutUploader = require("firstcut-uploader");

var _lodash = require("lodash");

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var snippet_extension = 'mp4';
var VIDEO_MIME_TYPES = ['video/x-flv', 'video/mp4', 'video/webm', 'video/ogg'];

function AssetFactory(Base, schema) {
  var Asset =
  /*#__PURE__*/
  function (_Base) {
    _inherits(Asset, _Base);

    function Asset() {
      _classCallCheck(this, Asset);

      return _possibleConstructorReturn(this, _getPrototypeOf(Asset).apply(this, arguments));
    }

    _createClass(Asset, [{
      key: "addToVersionReference",
      value: function addToVersionReference(version_name) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var self = this;
        var versions = self.versions;
        var existing_data = versions[version_name] || {};

        var combined_data = _objectSpread({}, existing_data, data);

        versions[version_name] = combined_data;
        self = self.set('versions', versions);
        return self;
      }
    }, {
      key: "setPath",
      value: function setPath(version, path) {
        return this.addToVersionReference(version, {
          meta: {
            pipePath: path
          }
        });
      }
    }, {
      key: "getPath",
      value: function getPath() {
        var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'original';

        if (!this.versions || !this.versions[version] || !this.versions[version].meta) {
          return '';
        }

        return this.versions[version].meta.pipePath;
      }
    }, {
      key: "displayName",
      get: function get() {
        return this.name;
      }
    }, {
      key: "bucket",
      get: function get() {
        return this.meta.bucket || Meteor.settings.public.s3.assets_bucket;
      },
      set: function set(bucket) {
        this.set('meta.bucket', bucket);
      }
    }, {
      key: "root",
      get: function get() {
        return this.meta.root;
      }
    }, {
      key: "isVideo",
      get: function get() {
        return VIDEO_MIME_TYPES.includes(this.type);
      }
    }], [{
      key: "footageFilesFolder",
      value: function footageFilesFolder(bucket) {
        return bucket + '/footage-folders/';
      }
    }, {
      key: "buildS3AssetPath",
      value: function buildS3AssetPath(file_ref, version) {
        var name = getAssetnameWithoutExtension(file_ref);
        name = (0, _sanitizeFilename.default)(name);
        var path = file_ref.root + '/' + name + '-' + version + '-' + file_ref._id + '.' + file_ref.extension;
        path = path.replace(/\/\//g, '/');
        return path;
      }
    }, {
      key: "buildSnippetRequestFilePath",
      value: function buildSnippetRequestFilePath(_ref) {
        var cut_file_ref = _ref.cut_file_ref,
            _ref$version = _ref.version,
            version = _ref$version === void 0 ? 'original' : _ref$version,
            start = _ref.start,
            end = _ref.end;
        var filename = this.getSnippetRequestFilename({
          cut_file_ref: cut_file_ref,
          start: start,
          end: end
        });
        var root = cut_file_ref.root;
        return root + '/' + filename;
      }
    }, {
      key: "getSnippetRequestFilename",
      value: function getSnippetRequestFilename(_ref2) {
        var cut_file_ref = _ref2.cut_file_ref,
            start = _ref2.start,
            end = _ref2.end;
        var snippet_request_prefix = 'snippet';
        var name = getAssetnameWithoutExtension(cut_file_ref);
        return "".concat(snippet_request_prefix, "_").concat(name, "_").concat(start, "_").concat(end, "_").concat(_meteorRandom.Random.id(), ".").concat(snippet_extension);
      }
    }, {
      key: "insert",
      value: function insert(options) {
        var record = this.createNew({});
        var file = options.file,
            meta = options.meta;
        var version = "original";
        var properties = extractPropertiesOfFile(file);
        console.log(meta);
        var name = properties.name,
            mime = properties.mime,
            type = properties.type,
            size = properties.size,
            extension = properties.extension;
        record = record.set('_id', _meteorRandom.Random.id());
        record = record.set('name', file.name);
        record = record.set('mime', file.type);
        record = record.set('type', file.type);
        record = record.set('fileSize', file.size);
        record = record.set('meta', meta);
        record = record.set('extension', extension);
        record = record.set('ext', extension);
        record = record.set('isVideo', record.isVideo);
        record = record.addToVersionReference(version, properties);
        var path = options.path ? options.path : this.buildS3AssetPath(record, version);
        record = record.setPath(version, path);
        var emitter = new _events.default();
        var promise = record.save();
        promise.catch(function (err) {
          return emitter.emit('error', err);
        });
        (0, _firstcutUploader.upload)({
          file: file,
          path: path,
          emitter: emitter,
          bucket: record.bucket
        });
        emitter.on('uploaded', function (awsKey) {
          record = record.setPath(version, awsKey);
          record.save();
          emitter.emit('progress', 1);
        });
        return {
          emitter: emitter,
          record: record
        };
      }
    }, {
      key: "collection_name",
      get: function get() {
        return 'assets';
      }
    }]);

    return Asset;
  }(Base);

  Asset.schema = schema;
  return Asset;
} // function buildS3AssetPath(file_ref, version) {
//   let name = getAssetnameWithoutExtension(file_ref);
//   name = sanitize(name);
//   return getAssetRoot({file_ref}) + '/' + name + '-' + version + '-' + (Random.id()) + '.' + file_ref.extension;
// }
//
// export function getAssetRoot({file_ref}) {
//   return (file_ref.meta) ? file_ref.meta.root: '';
// }


function extractPropertiesOfFile(file) {
  return {
    name: file.name,
    mime: file.type,
    type: file.type,
    extension: getExtension(file),
    fileSize: file.size
  };
}

function getAssetnameWithoutExtension(file_ref) {
  return removeExtension(file_ref.name);
}

function removeExtension(name) {
  var pieces = name.split('.');
  return _lodash._.first(pieces);
}

function getExtension(file) {
  var pieces = file.name.split('.');
  return _lodash._.last(pieces);
}