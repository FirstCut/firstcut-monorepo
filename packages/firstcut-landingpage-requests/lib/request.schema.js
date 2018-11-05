"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = require("firstcut-schema");

var RequestSchema = new _firstcutSchema.SimpleSchemaWrapper({
  _id: String,
  adId: String,
  first: String,
  last: String,
  email: String,
  about: String,
  company: String,
  website: String,
  tagline: String
});
RequestSchema.extend(_firstcutSchema.BaseSchema);
var _default = RequestSchema;
exports.default = _default;