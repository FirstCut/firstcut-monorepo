"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initUploader = initUploader;
exports.upload = upload;

var _cryptoJs = _interopRequireDefault(require("crypto-js"));

var _evaporate = _interopRequireDefault(require("evaporate"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

require('buffer').Buffer;
var defaultBucket = null;

function initUploader(config) {
  defaultBucket = config.assets_bucket;
  var evaporateConfig = {
    aws_key: config.key,
    bucket: config3.assets_bucket,
    awsRegion: config3.region,
    logging: config.environment === 'development',
    computeContentMd5: true,
    s3FileCacheHoursAgo: 4,
    awsSignatureVersion: '4',
    // partSize: 37748736, // aws mentioned 72 as ideal part size, this requires experimentation
    s3Acceleration: true,
    signerUrl: "".concat(config.PLATFORM_ROOT_URL, "/computeSignature"),
    cryptoMd5Method: function cryptoMd5Method(data) {
      return _awsSdk.default.util.crypto.md5(data, 'base64');
    },
    cryptoHexEncodedHash256: function cryptoHexEncodedHash256(data) {
      return _awsSdk.default.util.crypto.sha256(data, 'hex');
    }
  };

  _evaporate.default.create(evaporateConfig).then(function (eva) {
    evaporate = eva;
  });
}

var evaporate = null;

function upload(opts) {
  var file = opts.file,
      path = opts.path,
      emitter = opts.emitter,
      _opts$bucket = opts.bucket,
      bucket = _opts$bucket === void 0 ? defaultBucket : _opts$bucket;
  var config = {
    name: path,
    file: file,
    contentType: file.type,
    progress: function progress(val, stats) {
      emitter.emit('progress', val, stats);
    },
    complete: function complete(_xhr, awsKey) {
      emitter.emit('complete', awsKey);
    }
  };
  var overrides = {
    bucket: bucket
  };
  evaporate.add(config, overrides).then(function (awsObjectKey) {
    emitter.emit('uploaded', awsObjectKey);
  }, function (reason) {
    emitter.emit('error', reason);
  });
}

function hmac(key, value) {
  return _cryptoJs.default.HmacSHA256(value, key); // return AWS.util.crypto.lib.createHmac(value, key);
}