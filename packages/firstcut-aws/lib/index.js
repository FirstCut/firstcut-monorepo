"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initAwsIntegration = initAwsIntegration;
exports.s3 = exports.awsConf = void 0;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _s = _interopRequireDefault(require("aws-sdk/clients/s3"));

var awsConf = null;
exports.awsConf = awsConf;
var s3 = null;
exports.s3 = s3;

function initAwsIntegration(opts) {
  new _simplSchema.default({
    key: String,
    secret: String,
    region: String,
    bucket: String
  }).validate(opts);
  exports.awsConf = awsConf = opts;
  exports.s3 = s3 = new _s.default({
    secretAccessKey: awsConf.secret,
    accessKeyId: awsConf.key,
    region: awsConf.region,
    // sslEnabled: true, // optional
    useAccelerateEndpoint: true,
    httpOptions: {
      timeout: 12000,
      agent: false
    }
  });
}