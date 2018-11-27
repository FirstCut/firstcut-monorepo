"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ajv = _interopRequireDefault(require("ajv"));

var FirstCutSchema =
/*#__PURE__*/
function () {
  function FirstCutSchema(jsonSchema) {
    (0, _classCallCheck2.default)(this, FirstCutSchema);
    this.schema = jsonSchema;
  }

  (0, _createClass2.default)(FirstCutSchema, [{
    key: "validate",
    value: function validate(data) {
      var ajv = new _ajv.default(); // options can be passed, e.g. {allErrors: true}

      var validate = ajv.compile(this.schema);
      var valid = validate(data);
      return valid ? null : validate.errors;
    }
  }]);
  return FirstCutSchema;
}();

var _default = FirstCutSchema;
exports.default = _default;