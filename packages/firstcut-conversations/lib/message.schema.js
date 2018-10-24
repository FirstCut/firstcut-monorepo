"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = require("firstcut-schema");

var MessageSchema = new _firstcutSchema.SimpleSchemaWrapper({
  author: String,
  content: String,
  readBy: Array,
  'readBy.$': String
});
MessageSchema.extends(_firstcutSchema.BaseSchema);
var _default = MessageSchema;
exports.default = _default;