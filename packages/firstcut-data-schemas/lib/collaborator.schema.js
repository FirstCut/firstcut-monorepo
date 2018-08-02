"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutSchemaBuilder = require("firstcut-schema-builder");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _locationSchema = _interopRequireDefault(require("./shared/location.schema.js"));

var _profileSchema = _interopRequireDefault(require("./shared/profile.schema.js"));

var _baseSchema = _interopRequireDefault(require("./shared/base.schema.js"));

var _firstcutEnum = require("firstcut-enum");

var _firstcutRegex = _interopRequireDefault(require("firstcut-regex"));

var CollaboratorSchema = new _firstcutSchemaBuilder.FCSchema({
  type: {
    //TODO: we should remove this all together righ LUCY?
    type: String,
    label: "Type",
    enumOptions: _firstcutEnum.COLLABORATOR_TYPES
  },
  "activeShootId": {
    /*TODO: make this a helper that refers to the status of shoot */
    type: String
  },
  "isActive": {
    type: Boolean,
    label: "isActive"
  },
  "taxCompliant": {
    type: Boolean
  },
  "skills": {
    type: Array
  },
  "skills.$": {
    type: Object
  },
  "skills.$.type": {
    type: String,
    required: true,
    enumOptions: _firstcutEnum.COLLABORATOR_SKILLS
  },
  "skills.$.isQualified": {
    type: Boolean
  },
  "skills.$.rating": {
    type: _simplSchema.default.Integer
  },
  "paymentMethod": {
    type: Array,
    restricted: true
  },
  "paymentMethod.$": {
    type: Object
  },
  "paymentMethod.$.type": {
    type: String,
    required: true,
    enumOptions: _firstcutEnum.PAYMENT_METHODS
  },
  "paymentMethod.$.accountEmail": {
    type: String,
    regEx: _firstcutRegex.default.Email
  }
});
CollaboratorSchema.extend(_baseSchema.default);
CollaboratorSchema.extend(_profileSchema.default);
CollaboratorSchema.extend(_locationSchema.default);
var _default = CollaboratorSchema;
exports.default = _default;