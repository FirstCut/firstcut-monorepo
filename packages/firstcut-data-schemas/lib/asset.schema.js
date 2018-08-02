"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

var _baseSchema = _interopRequireDefault(require("./shared/base.schema.js"));

var FileSchema = new _firstcutSchemaBuilder.FCSchema({
  fileSize: {
    type: Number
  },
  name: {
    type: String
  },
  type: {
    type: String
  },
  extension: {
    type: String
  },
  ext: {
    type: String
  },
  isVideo: {
    type: Boolean
  },
  mime: {
    type: String
  },
  meta: {
    type: Object,
    blackbox: true
  },
  versions: {
    type: Object,
    blackbox: true
  }
});
FileSchema.extend(_baseSchema.default);
var _default = FileSchema;
exports.default = _default;