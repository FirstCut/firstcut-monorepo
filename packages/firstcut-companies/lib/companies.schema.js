"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _schema = require("/imports/api/schema");

var _base = _interopRequireDefault(require("/imports/api/schema/base.schema"));

var _location = _interopRequireDefault(require("/imports/api/schema/location.schema"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var CompanySchema = new _schema.SimpleSchemaWrapper({
  name: {
    type: String,
    label: 'Company Name',
    required: true // unique: true,

  },
  website: {
    type: String,
    label: 'Company Website' // regEx: SimpleSchema.RegEx.Url,
    // unique: true,

  },
  brandIntroId: {
    type: String,
    label: 'Brand Into File',
    customType: 'file',
    store: 'cuts',
    helpText: 'Animated logo file'
  },
  branding: {
    type: Array,
    customType: 'fileArray',
    store: 'assets',
    label: 'Brand Asset',
    helpText: 'Logo file, Font File, Style Guidelines, etc'
  },
  'branding.$': _simplSchema.default.oneOf({
    type: String
  }, {
    type: Object,
    blackbox: true
  })
});
CompanySchema.extend(_base.default);
CompanySchema.extend(_location.default);
var _default = CompanySchema;
exports.default = _default;