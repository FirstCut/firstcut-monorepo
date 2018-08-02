"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

var _baseSchema = _interopRequireDefault(require("./shared/base.schema.js"));

var _profileSchema = _interopRequireDefault(require("./shared/profile.schema.js"));

var _locationSchema = _interopRequireDefault(require("./shared/location.schema.js"));

var ClientSchema = new _firstcutSchemaBuilder.FCSchema({
  companyId: {
    type: String,
    serviceDependency: 'COMPANY',
    label: 'Company',
    required: true
  }
});
ClientSchema.extend(_baseSchema.default);
ClientSchema.extend(_profileSchema.default);
ClientSchema.extend(_locationSchema.default);
var _default = ClientSchema;
exports.default = _default;