"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var generateImmutableDefaults = function generateImmutableDefaults(schema) {
  var flat_array_types = ['stringArray', 'booleanArray', 'dateArray', 'numberArray'];
  var defaults = {};
  schema.objectKeys().forEach(function (key) {
    var quick_type = schema.getQuickTypeForKey(key);

    if (quick_type == 'objectArray') {
      defaults[key] = (0, _immutable.List)();
      return;
    } else if (quick_type == 'object') {
      var subschema = schema.constructor.fromSubSchema(schema, key);
      defaults[key] = (0, _immutable.Record)(generateImmutableDefaults(subschema))();
      return;
    } else if (flat_array_types.includes(quick_type)) {
      defaults[key] = (0, _immutable.List)();
      return;
    } else {
      defaults[key] = undefined;
      return;
    }
  });
  return defaults;
};

var _default = generateImmutableDefaults;
exports.default = _default;