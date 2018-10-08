"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _s = _interopRequireDefault(require("aws-sdk/clients/s3"));

var _sqs = _interopRequireDefault(require("aws-sdk/clients/sqs"));

var FirstcutAWS =
/*#__PURE__*/
function () {
  function FirstcutAWS(opts) {
    (0, _classCallCheck2.default)(this, FirstcutAWS);
    new _simplSchema.default({
      key: String,
      secret: String,
      region: String,
      bucket: String
    }).validate(opts);
    this.conf = opts;
  }

  (0, _createClass2.default)(FirstcutAWS, [{
    key: "getS3",
    value: function getS3() {
      return new _s.default({
        secretAccessKey: this.conf.secret,
        accessKeyId: this.conf.key,
        region: this.conf.region,
        // sslEnabled: true, // optional
        useAccelerateEndpoint: true,
        httpOptions: {
          timeout: 12000,
          agent: false
        }
      });
    }
  }, {
    key: "getSQS",
    value: function getSQS() {
      return new _sqs.default({
        secretAccessKey: this.conf.secret,
        accessKeyId: this.conf.key,
        region: this.conf.region
      });
    }
  }]);
  return FirstcutAWS;
}();

var _default = FirstcutAWS;
exports.default = _default;