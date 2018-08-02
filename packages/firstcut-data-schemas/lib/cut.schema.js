"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

var _firstcutEnum = require("firstcut-enum");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _firstcutRegex = _interopRequireDefault(require("firstcut-regex"));

var _baseSchema = _interopRequireDefault(require("./shared/base.schema.js"));

var CutSchema = new _firstcutSchemaBuilder.FCSchema({
  fileId: {
    type: _simplSchema.default.oneOf(String, {
      type: Object,
      blackbox: true
    }),
    label: 'File',
    customType: 'file',
    store: 'cuts'
  },
  fileVersion: {
    type: String,
    label: 'File Version Name',
    hidden: true
  },
  deliverableId: {
    type: String,
    label: "Deliverable",
    required: true,
    serviceDependency: 'DELIVERABLE'
  },
  type: {
    type: String,
    sortBy: 'off',
    enumOptions: _firstcutEnum.CUT_TYPES,
    required: true
  },
  fileUrl: {
    type: String,
    label: "Cut File URL",
    regEx: _firstcutRegex.default.Url
  },
  version: {
    required: true,
    type: Number
  },
  verified: {
    type: Boolean
  },
  editorNotes: {
    type: String,
    label: 'Editor Notes',
    helpText: "Anything about this CUT that you want to communicate to the project manager or the client.",
    customType: 'textarea'
  },
  revisions: {
    type: String,
    label: 'Feedback',
    customType: 'textarea'
  }
});
CutSchema.extend(_baseSchema.default);
var _default = CutSchema;
exports.default = _default;