"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = _interopRequireWildcard(require("firstcut-schema"));

var FileSchema = new _firstcutSchema.SimpleSchemaWrapper({
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
FileSchema.extend(_firstcutSchema.default);
var _default = FileSchema;
exports.default = _default;