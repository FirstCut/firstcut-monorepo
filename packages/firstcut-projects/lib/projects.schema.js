"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutBlueprints = require("firstcut-blueprints");

var _projects = require("./projects.enum");

var _firstcutSchema = _interopRequireDefault(require("firstcut-schema"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var ProjectSchema = new _firstcutBlueprints.BlueprintableSchema({
  isDummy: {
    type: Boolean
  },
  name: {
    type: String,
    required: true,
    label: 'Project Name'
  },
  salesforceId: {
    type: String
  },
  clientOwnerId: {
    type: String,
    required: true,
    label: 'Client Owner',
    serviceDependency: 'CLIENT'
  },
  adminOwnerId: {
    type: String,
    label: 'Admin Owner',
    required: true,
    serviceDependency: 'COLLABORATOR',
    serviceFilter: {
      skills: {
        $elemMatch: {
          type: 'VIDEO_PROJECT_MANAGEMENT',
          isQualified: true
        }
      }
    }
  },
  stage: {
    type: String,
    enumOptions: _projects.STAGES,
    sortBy: 'off'
  },
  additionalClientTeamMemberIds: {
    type: Array,
    label: 'Additional Client Team Members',
    customType: 'multiselect',
    serviceDependency: 'CLIENT'
  },
  'additionalClientTeamMemberIds.$': {
    type: String
  },
  companyId: {
    type: String,
    label: 'Company',
    required: true,
    serviceDependency: 'COMPANY'
  },
  SOWFile: {
    type: String,
    label: 'SOW File',
    customType: 'file'
  },
  notes: {
    type: String,
    customType: 'textarea'
  },
  invoiceAmount: {
    type: Number
  },
  executiveProducer: {
    type: String,
    serviceDependency: 'Collaborator'
  },
  producerHours: {
    type: Number
  },
  projectArchive: {
    type: Array,
    customType: 'fileArray'
  },
  'projectArchive.$': {
    type: String
  },
  assets: {
    type: Array,
    customType: 'fileArray'
  },
  'assets.$': _simplSchema.default.oneOf({
    // collectionfs Ids
    type: String
  }, {
    type: Object,
    blackbox: true
  })
});
ProjectSchema.extend(_firstcutSchema.default);
var _default = ProjectSchema;
exports.default = _default;