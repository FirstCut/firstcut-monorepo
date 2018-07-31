"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initUploader = initUploader;
exports.upload = upload;

var _evaporate = _interopRequireDefault(require("evaporate"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("buffer").Buffer;
var evaporate_config = {};

function initUploader(conf) {
  evaporate_config = {
    aws_key: conf.aws_key,
    bucket: conf.bucket,
    awsRegion: conf.awsRegion,
    computeContentMd5: true,
    s3FileCacheHoursAgo: 4,
    awsSignatureVersion: '4',
    allowS3ExistenceOptimization: true,
    s3Acceleration: true,
    signerUrl: conf.computeSignatureEndpoint,
    cryptoMd5Method: function cryptoMd5Method(data) {
      return _awsSdk.default.util.crypto.md5(data, 'base64');
    },
    cryptoHexEncodedHash256: function cryptoHexEncodedHash256(data) {
      return _awsSdk.default.util.crypto.sha256(data, 'hex');
    } // cryptoMd5Method: function (data) { return crypto.createHash('md5').update(data).digest('base64'); },

  };
}

function upload(opts) {
  var file = opts.file,
      path = opts.path,
      emitter = opts.emitter,
      _opts$bucket = opts.bucket,
      bucket = _opts$bucket === void 0 ? Meteor.settings.public.s3.assets_bucket : _opts$bucket;
  return _evaporate.default.create(evaporate_config).then(function (evaporate) {
    var config = {
      name: path,
      file: file,
      contentType: file.type,
      progress: function progress(val) {
        emitter.emit('progress', val);
      },
      complete: function complete(_xhr, awsKey) {
        emitter.emit('complete', awsKey);
      }
    };
    var overrides = {
      bucket: bucket
    };
    evaporate.add(config, overrides).then(function (awsObjectKey) {
      console.log('File successfully uploaded to:', awsObjectKey);
      emitter.emit('uploaded', awsObjectKey);
    }, function (reason) {
      emitter.emit('error', reason);
    });
  });
}