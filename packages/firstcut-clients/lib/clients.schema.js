"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = require("firstcut-schema");

var ClientSchema = new _firstcutSchema.SimpleSchemaWrapper({
  companyId: {
    type: String,
    serviceDependency: 'COMPANY',
    label: 'Company',
    required: true
  }
});
ClientSchema.extend(_firstcutSchema.BaseSchema);
ClientSchema.extend(_firstcutSchema.ProfileSchema);
ClientSchema.extend(_firstcutSchema.LocationSchema);
var _default = ClientSchema;
exports.default = _default;