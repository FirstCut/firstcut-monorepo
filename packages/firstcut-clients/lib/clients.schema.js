"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = _interopRequireWildcard(require("firstcut-schema"));

var ClientSchema = new _firstcutSchema.SimpleSchemaWrapper({
  companyId: {
    type: String,
    serviceDependency: 'COMPANY',
    label: 'Company',
    required: true
  }
});
ClientSchema.extend(_firstcutSchema.default);
ClientSchema.extend(_firstcutSchema.default);
ClientSchema.extend(_firstcutSchema.default);
var _default = ClientSchema;
exports.default = _default;