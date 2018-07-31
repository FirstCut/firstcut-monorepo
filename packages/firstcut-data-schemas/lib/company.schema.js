"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

var _baseSchema = _interopRequireDefault(require("./shared/base.schema.js"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _locationSchema = _interopRequireDefault(require("./shared/location.schema.js"));

var _firstcutRegex = _interopRequireDefault(require("firstcut-regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CompanySchema = new _firstcutSchemaBuilder.FCSchema({
  name: {
    type: String,
    label: "Company Name",
    required: true
  },
  website: {
    type: String,
    label: "Company Website",
    regEx: _firstcutRegex.default.Url
  },
  brandIntroId: {
    type: String,
    label: 'Brand Into File',
    customType: 'file',
    store: 'cuts',
    helpText: "Animated logo file"
  },
  branding: {
    type: Array,
    customType: 'fileArray',
    store: 'assets',
    label: "Brand Assets",
    helpText: "Logo file, Font File, Style Guidelines, etc"
  },
  'branding.$': _simplSchema.default.oneOf({
    type: String
  }, {
    type: Object,
    blackbox: true
  })
});
CompanySchema.extend(_baseSchema.default);
CompanySchema.extend(_locationSchema.default);
var _default = CompanySchema;
exports.default = _default;