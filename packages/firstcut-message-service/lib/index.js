"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _sqs = _interopRequireDefault(require("aws-sdk/clients/sqs"));

var Messenger = function Messenger(options) {
  (0, _classCallCheck2.default)(this, Messenger);
  var key = options.key,
      secret = options.secret,
      region = options.region;

  if (!key || !secret || !region) {
    throw new Error('crendentials for messenger not provided. Requires AWS access key, secret, and region');
  }

  this.provider = new _sqs.default({
    secretAccessKey: secret,
    accessKeyId: key,
    region: region
  });
};

exports.default = Messenger;