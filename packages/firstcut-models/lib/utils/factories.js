"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RecordWithSchemaFactory;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _generateDefaults = _interopRequireDefault(require("./generate-defaults.js"));

function RecordWithSchemaFactory(base, schema) {
  var RecordWithSchema =
  /*#__PURE__*/
  function (_base) {
    (0, _inherits2.default)(RecordWithSchema, _base);

    function RecordWithSchema(properties) {
      (0, _classCallCheck2.default)(this, RecordWithSchema);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RecordWithSchema).call(this, (0, _objectSpread2.default)({}, properties)));
    }

    (0, _createClass2.default)(RecordWithSchema, [{
      key: "schema",
      get: function get() {
        return this.constructor.schema;
      }
    }]);
    return RecordWithSchema;
  }(base((0, _generateDefaults.default)(schema)));

  RecordWithSchema.schema = schema;
  return RecordWithSchema;
}