"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lambda = exports.s3_conf = exports.s3 = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _firstcutMeteor = require("firstcut-meteor");

var _stream = _interopRequireDefault(require("stream"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _fs = _interopRequireDefault(require("fs"));

var _s = _interopRequireDefault(require("aws-sdk/clients/s3"));

var _lambda = _interopRequireDefault(require("aws-sdk/clients/lambda"));

// const { S3, Lambda  } = AWS.clients;
console.log('HELLO I SHOIODNT EHER');

function getS3Config() {
  return (0, _objectSpread2.default)({}, _firstcutMeteor.Meteor.settings.s3, {
    bucket: _firstcutMeteor.Meteor.settings.public.s3bucket
  });
}

function s3Configured() {
  var conf = getS3Config();
  return conf && conf.key && conf.secret && conf.bucket && conf.region;
}

if (!s3Configured()) {
  throw new _firstcutMeteor.Meteor.Error(401, 'Missing Meteor file settings');
}

var conf = getS3Config();
exports.s3_conf = conf;
var s3 = new _s.default({
  secretAccessKey: conf.secret,
  accessKeyId: conf.key,
  region: conf.region,
  // sslEnabled: true, // optional
  useAccelerateEndpoint: true,
  httpOptions: {
    timeout: 12000,
    agent: false
  }
});
exports.s3 = s3;
var lambda = new _lambda.default({
  secretAccessKey: conf.secret,
  accessKeyId: conf.key,
  region: conf.region,
  httpOptions: {
    timeout: 300000 // max lambda timeout

  }
});
exports.lambda = lambda;
lambda.snippet_creator = _firstcutMeteor.Meteor.settings.lambda.snippet_creator;
lambda.copy_footage = _firstcutMeteor.Meteor.settings.lambda.copy_footage;

function enableAcceleration(bucket) {
  s3.putBucketAccelerateConfiguration({
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

enableAcceleration(conf.bucket);
enableAcceleration(_firstcutMeteor.Meteor.settings.public.source_footage_bucket);
enableAcceleration(_firstcutMeteor.Meteor.settings.public.target_footage_bucket); // s3.delete = function (vref) {
//   return new Promise((resolve, reject) => {
//     if (!(vref && vref.meta && vref.meta.pipePath)) {
//       reject(new Meteor.Error('invalid-params', 'vref not configured to use s3. Cannot delete'));
//     }
//     const file_key = vref.meta.pipePath;
//     s3.deleteObject({
//       Bucket: conf.bucket,
//       Key: file_key,
//     }, (error) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve();
//       }
//     });
//   });
// };
//
// s3.put = function (vref, path, version) {
//   return new Promise((resolve, reject) => {
//     s3.putObject({
//       // ServerSideEncryption: 'AES256', // Optional
//       StorageClass: 'STANDARD',
//       Bucket: conf.bucket,
//       Key: path,
//       Body: fs.createReadStream(vref.path),
//       ContentType: vref.type,
//     }, (error) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve({ vref, path, version });
//       }
//     });
//   });
// };
//