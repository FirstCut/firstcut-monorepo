"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlueprintableSchema = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _schema = require("/imports/api/schema");

var _immutable = require("immutable");

var BlueprintableSchema =
/*#__PURE__*/
function (_SimpleSchemaWrapper) {
  (0, _inherits2.default)(BlueprintableSchema, _SimpleSchemaWrapper);

  function BlueprintableSchema(schema) {
    var _this;

    (0, _classCallCheck2.default)(this, BlueprintableSchema);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(BlueprintableSchema).call(this, schema));

    _this.extend({
      blueprint: {
        type: String
      }
    });

    return _this;
  }

  (0, _createClass2.default)(BlueprintableSchema, [{
    key: "setBlueprintOptions",
    value: function setBlueprintOptions(blueprints) {
      var getBlueprintOptions = function getBlueprintOptions() {
        return (0, _immutable.List)((0, _keys.default)(blueprints).map(function (b) {
          return {
            key: b,
            value: b,
            text: blueprints[b].label
          };
        }));
      };

      this.extend({
        blueprint: {
          allowedValues: (0, _keys.default)(blueprints),
          options: getBlueprintOptions
        }
      });
    }
  }]);
  return BlueprintableSchema;
}(_schema.SimpleSchemaWrapper);

exports.BlueprintableSchema = BlueprintableSchema;