"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFilestore = initFilestore;
exports.filestore = exports.conf = void 0;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _s = _interopRequireDefault(require("aws-sdk/clients/s3"));

var conf = null;
exports.conf = conf;
var filestore = null;
exports.filestore = filestore;

function initFilestore(opts) {
  new _simplSchema.default({
    key: String,
    secret: String,
    region: String,
    bucket: String
  }).validate(opts);
  exports.conf = conf = opts;
  exports.filestore = filestore = new _s.default({
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
}