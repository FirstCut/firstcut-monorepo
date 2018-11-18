"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = require("firstcut-schema");

var MessageSchema = new _firstcutSchema.SimpleSchemaWrapper({
  authorId: String,
  text: String,
  readBy: Array,
  'readBy.$': String,
  projectId: String
});
MessageSchema.extend(_firstcutSchema.BaseSchema);
var _default = MessageSchema;
exports.default = _default;