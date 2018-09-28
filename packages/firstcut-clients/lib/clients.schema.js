"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _schema = require("/imports/api/schema");

var _base = _interopRequireDefault(require("/imports/api/schema/base.schema"));

var _profile = _interopRequireDefault(require("/imports/api/schema/profile.schema"));

var _location = _interopRequireDefault(require("/imports/api/schema/location.schema"));

var ClientSchema = new _schema.SimpleSchemaWrapper({
  companyId: {
    type: String,
    serviceDependency: 'COMPANY',
    label: 'Company',
    required: true
  }
});
ClientSchema.extend(_base.default);
ClientSchema.extend(_profile.default);
ClientSchema.extend(_location.default);
var _default = ClientSchema;
exports.default = _default;