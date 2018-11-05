"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = require("firstcut-schema");

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
    store: 'cuts'
  },
  branding: {
    type: Array,
    customType: 'fileArray',
    store: 'assets',
    label: 'Brand Asset'
  },
  'branding.$': _simplSchema.default.oneOf({
    type: String
  }, {
    type: Object,
    blackbox: true
  })
});
CompanySchema.extend(_firstcutSchema.BaseSchema);
CompanySchema.extend(_firstcutSchema.LocationSchema);
var _default = CompanySchema;
exports.default = _default;