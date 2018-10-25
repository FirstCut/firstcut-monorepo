"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFilestoreService = initFilestoreService;
exports.fileRefFromId = fileRefFromId;
exports.getPathFromId = getPathFromId;
exports.getSignedUrl = getSignedUrl;
exports.getSignedUrlOfKey = getSignedUrlOfKey;
exports.listObjects = listObjects;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var filestore = null;
var Models = null;

function initFilestoreService(models, service) {
  console.log('INIT FILESTORE');
  filestore = service;
  Models = models;
}

function listObjects(args) {
  if (!filestore) {
    throw new Error('not-initialized', 'filestore not initialized');
  }

  return new Promise(function (resolve, reject) {
    filestore.listObjects(args, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function getSignedUrl(args) {
  if (!filestore) {
    throw new Error('not-initialized', 'filestore not initialized');
  }

  new _simplSchema.default({
    fileId: String,
    version: {
      type: String,
      optional: true,
      defaultValue: 'original'
    }
  }).validate(args);
  var fileId = args.fileId,
      version = args.version;
  var key = getPathFromId({
    fileId: fileId,
    version: version
  });
  var file = fileRefFromId({
    fileId: fileId,
    version: version
  });
  var bucket = file && file.bucket ? file.bucket : filestore.bucket;
  return getSignedUrlOfKey({
    key: key,
    bucket: bucket
  });
}

function getSignedUrlOfKey(args) {
  if (!filestore) {
    throw new Error('not-initialized', 'filestore not initialized');
  }

  var bucket = args.bucket,
      key = args.key;
  new _simplSchema.default({
    key: String,
    bucket: {
      type: String,
      optional: true
    }
  }).validate(args);
  return new Promise(function (resolve, reject) {
    if (!key) {
      resolve('');
    }

    var params = {
      Bucket: bucket,
      Key: key,
      Expires: 2592000
    };
    filestore.getSignedUrl('getObject', params, function (err, url) {
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
  return Models.Asset.fromId(fileId);
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