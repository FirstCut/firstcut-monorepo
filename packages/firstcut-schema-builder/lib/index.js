"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "FCSchema", {
  enumerable: true,
  get: function get() {
    return _firstcutSchema.default;
  }
});
Object.defineProperty(exports, "SchemaParser", {
  enumerable: true,
  get: function get() {
    return _schemaParser.default;
  }
});

var _firstcutSchema = _interopRequireDefault(require("./firstcut.schema.js"));

var _schemaParser = _interopRequireDefault(require("./schema.parser.js"));