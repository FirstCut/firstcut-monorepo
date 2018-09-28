"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var _schema = require("/imports/api/schema");

var _collaborators = require("./collaborators.enum");

var CollaboratorSchema = new _schema.SimpleSchemaWrapper({
  type: {
    // TODO: we should remove this all together righ LUCY?
    type: String,
    label: 'Type',
    enumOptions: _collaborators.COLLABORATOR_TYPES,
    restricted: true
  },
  activeShootId: {
    /* TODO: make this a helper that refers to the status of shoot */
    type: String,
    restricted: true
  },
  applicationNotes: {
    type: String,
    customType: 'textarea',
    label: 'Tell us more about yourself',
    restricted: true
  },
  portfolioUrl: {
    type: String,
    optional: true,
    restricted: true
  },
  isActive: {
    type: Boolean,
    label: 'isActive'
  },
  taxCompliant: {
    type: Boolean,
    restricted: true
  },
  skills: {
    type: Array
  },
  'skills.$': {
    type: Object
  },
  'skills.$.type': {
    type: String,
    required: true,
    enumOptions: _collaborators.COLLABORATOR_SKILLS
  },
  'skills.$.isQualified': {
    type: Boolean
  },
  'skills.$.rating': {
    type: _simplSchema.default.Integer
  },
  paymentMethod: {
    type: Array,
    restricted: true
  },
  'paymentMethod.$': {
    type: Object
  },
  'paymentMethod.$.type': {
    type: String,
    required: true,
    enumOptions: _collaborators.PAYMENT_METHODS
  },
  'paymentMethod.$.accountEmail': {
    type: String
  }
});
CollaboratorSchema.extend(_schema.BaseSchema);
CollaboratorSchema.extend(_schema.ProfileSchema);
CollaboratorSchema.extend(_schema.LocationSchema);
var _default = CollaboratorSchema;
exports.default = _default;