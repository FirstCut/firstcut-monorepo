"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _schema = require("/imports/api/schema");

var _base = _interopRequireDefault(require("/imports/api/schema/base.schema"));

var FileSchema = new _schema.SimpleSchemaWrapper({
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
FileSchema.extend(_base.default);
var _default = FileSchema;
exports.default = _default;