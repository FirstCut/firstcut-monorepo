"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchema = _interopRequireWildcard(require("firstcut-schema"));

var _cuts = require("./cuts.enum");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var CutSchema = new _firstcutSchema.SimpleSchemaWrapper({
  fileId: {
    type: _simplSchema.default.oneOf(String, {
      type: Object,
      blackbox: true
    }),
    label: 'Video File',
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
    label: 'Deliverable',
    required: true,
    serviceDependency: 'DELIVERABLE'
  },
  type: {
    type: String,
    sortBy: 'off',
    enumOptions: _cuts.CUT_TYPES,
    required: true
  },
  fileUrl: {
    type: String,
    label: 'Cut File URL',
    regEx: _simplSchema.default.RegEx.Url
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
    helpText: 'Anything about this CUT that you want to communicate to the project manager or the client.',
    customType: 'textarea'
  },
  revisions: {
    type: String,
    label: 'Feedback',
    customType: 'textarea'
  }
});
CutSchema.extend(_firstcutSchema.default);
var _default = CutSchema;
exports.default = _default;