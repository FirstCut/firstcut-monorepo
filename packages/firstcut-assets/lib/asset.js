"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _sanitizeFilename = _interopRequireDefault(require("sanitize-filename"));

var _meteorStandaloneRandom = require("meteor-standalone-random");

var _firstcutUploader = require("firstcut-uploader");

var _lodash = require("lodash");

var _events = _interopRequireDefault(require("events"));

var _assets = _interopRequireDefault(require("./assets.schema"));

var _firstcutModelBase = require("firstcut-model-base");

var Base = (0, _firstcutModelBase.createBaseModel)(_assets.default);
var snippetExtension = 'mp4';
var VIDEO_MIME_TYPES = ['video/x-flv', 'video/mp4', 'video/webm', 'video/ogg'];

var Asset =
/*#__PURE__*/
function (_Base) {
  (0, _inherits2.default)(Asset, _Base);

  function Asset() {
    (0, _classCallCheck2.default)(this, Asset);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Asset).apply(this, arguments));
  }

  (0, _createClass2.default)(Asset, [{
    key: "addToVersionReference",
    value: function addToVersionReference(versionName) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var self = this;
      var existingData = self.versions[versionName] || {};
      var combinedData = (0, _objectSpread2.default)({}, existingData, data);
      self.versions[versionName] = combinedData;
      self = self.set('versions', self.versions);
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
      return "".concat(bucket, "/footage-folders/");
    }
  }, {
    key: "buildS3AssetPath",
    value: function buildS3AssetPath(fileRef, version) {
      var name = getAssetnameWithoutExtension(fileRef);
      name = (0, _sanitizeFilename.default)(name);
      var path = "".concat(fileRef.root, "/").concat(name, "-").concat(version, "-").concat(fileRef._id, ".").concat(fileRef.extension);
      path = path.replace(/\/\//g, '/');
      return path;
    }
  }, {
    key: "buildSnippetRequestFilePath",
    value: function buildSnippetRequestFilePath(_ref) {
      var cutFileRef = _ref.cutFileRef,
          start = _ref.start,
          end = _ref.end;
      var filename = this.getSnippetRequestFilename({
        cutFileRef: cutFileRef,
        start: start,
        end: end
      });
      return "".concat(cutFileRef.root, "/").concat(filename);
    }
  }, {
    key: "getSnippetRequestFilename",
    value: function getSnippetRequestFilename(_ref2) {
      var cutFileRef = _ref2.cutFileRef,
          start = _ref2.start,
          end = _ref2.end;
      var snippetRequestPrefix = 'snippet';
      var name = getAssetnameWithoutExtension(cutFileRef);
      return "".concat(snippetRequestPrefix, "_").concat(name, "_").concat(start, "_").concat(end, "_").concat(_meteorStandaloneRandom.Random.id(), ".").concat(snippetExtension);
    }
  }, {
    key: "insert",
    value: function insert(options) {
      var record = this.createNew({});
      var file = options.file,
          meta = options.meta;
      var version = 'original';
      var properties = extractPropertiesOfFile(file);
      var extension = properties.extension;
      record = record.set('_id', _meteorStandaloneRandom.Random.id());
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
      return {
        emitter: emitter,
        record: record
      };
    }
  }, {
    key: "collectionName",
    get: function get() {
      return 'assets';
    }
  }, {
    key: "schema",
    get: function get() {
      return _assets.default;
    }
  }]);
  return Asset;
}(Base);

function extractPropertiesOfFile(file) {
  return {
    name: file.name,
    mime: file.type,
    type: file.type,
    extension: getExtension(file),
    fileSize: file.size
  };
}

function getAssetnameWithoutExtension(fileRef) {
  return removeExtension(fileRef.name);
}

function removeExtension(name) {
  var pieces = name.split('.');
  return _lodash._.first(pieces);
}

function getExtension(file) {
  var pieces = file.name.split('.');
  return _lodash._.last(pieces);
}

var _default = Asset;
exports.default = _default;