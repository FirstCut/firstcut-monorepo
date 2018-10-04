"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileRefFromId = fileRefFromId;
exports.getPathFromId = getPathFromId;

var _firstcutModels = _interopRequireDefault(require("firstcut-models"));

var _config = require("./config.js");

function enableAcceleration(bucket) {
  _config.filestore.putBucketAccelerateConfiguration({
    AccelerateConfiguration: {
      /* required */
      Status: 'Enabled'
    },
    Bucket: bucket
  }, function (err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    }
  });
}

function executeAsyncWithCallback(func, cb) {}

function listObjects(args) {
  return new Promise(function (resolve, reject) {
    _config.filestore.listObjects(args, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function getSignedUrl(args) {
  var fileId = args.fileId,
      version = args.version;
  var key = getPathFromId({
    fileId: fileId,
    version: version
  });
  return getSignedUrlOfKey({
    key: key
  });
}

function getSignedUrlOfKey(args) {
  var _args$bucket = args.bucket,
      bucket = _args$bucket === void 0 ? _config.conf.bucket : _args$bucket,
      key = args.key;
  return new Promise(function (resolve, reject) {
    if (!key) {
      resolve('');
    }

    var params = {
      Bucket: bucket,
      Key: key,
      Expires: 2592000
    };

    _config.filestore.getSignedUrl('getObject', params, function (err, url) {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

function fileRefFromId(_ref) {
  var fileId = _ref.fileId,
      _ref$version = _ref.version,
      version = _ref$version === void 0 ? 'original' : _ref$version;
  return _firstcutModels.default.Asset.fromId(fileId);
}

function getPathFromId(_ref2) {
  var fileId = _ref2.fileId,
      _ref2$version = _ref2.version,
      version = _ref2$version === void 0 ? 'original' : _ref2$version;
  var asset = fileRefFromId({
    fileId: fileId,
    version: version
  });

  if (!asset) {
    return '';
  }

  return asset.getPath(version);
}