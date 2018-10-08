"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = _interopRequireWildcard(require("firstcut-schema"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var CompanySchema = new _firstcutSchema.SimpleSchemaWrapper({
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
CompanySchema.extend(_firstcutSchema.BaseSchema);
CompanySchema.extend(_firstcutSchema.default);
var _default = CompanySchema;
exports.default = _default;