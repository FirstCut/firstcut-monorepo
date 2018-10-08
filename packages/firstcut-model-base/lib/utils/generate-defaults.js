"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

function generateImmutableDefaults(schema) {
  var flatArrayTypes = ['stringArray', 'booleanArray', 'dateArray', 'numberArray'];
  var result = schema.objectKeys().reduce(function (res, key) {
    var defaults = res;
    var quickType = schema.getQuickTypeForKey(key);
    var isBlackbox = schema.getFieldSchema(key).blackbox === true;

    if (quickType === 'objectArray') {
      defaults[key] = (0, _immutable.List)();
    } else if (quickType === 'object' && !isBlackbox) {
      var subschema = schema.constructor.fromSubSchema(schema, key);
      defaults[key] = (0, _immutable.Record)(generateImmutableDefaults(subschema))();
    } else if (flatArrayTypes.includes(quickType)) {
      defaults[key] = (0, _immutable.List)();
    } else if (isBlackbox) {
      defaults[key] = {};
    } else {
      defaults[key] = undefined;
    }

    return defaults;
  }, {});
  return result;
}

var _default = generateImmutableDefaults;
exports.default = _default;