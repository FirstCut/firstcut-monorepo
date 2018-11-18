"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutBlueprints = require("firstcut-blueprints");

var _firstcutSchema = require("firstcut-schema");

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

var DeliverableSchema = new _firstcutBlueprints.BlueprintableSchema({
  name: {
    type: String,
    placeholder: 'optional'
  },
  projectId: {
    label: 'Project',
    placeholder: 'select parent project',
    type: String,
    required: true,
    serviceDependency: 'PROJECT'
  },
  clientOwnerId: {
    type: String,
    label: 'Client Owner',
    serviceDependency: 'CLIENT',
    required: true
  },
  postpoOwnerId: {
    type: String,
    label: 'PostProduction by',
    serviceDependency: 'COLLABORATOR',
    serviceFilter: {
      skills: {
        $elemMatch: {
          type: {
            $in: ['VIDEO_EDITING', 'MOTIONGRAPHICS']
          },
          isQualified: true
        }
      }
    }
  },
  assets: {
    restricted: true,
    type: Array,
    customType: 'fileArray'
  },
  'assets.$': _simplSchema.default.oneOf({
    // collectionfs Ids
    type: String
  }, {
    type: Object,
    blackbox: true
  }),
  estimatedDuration: {
    type: _simplSchema.default.Integer,
    restricted: true,
    label: 'Estimated Duration (in seconds)',
    required: true
  },
  nextCutDue: {
    restricted: true,
    type: Date
  },
  songs: {
    restricted: true,
    type: Array
  },
  'songs.$': {
    type: Object
  },
  'songs.$.name': {
    type: String,
    required: true
  },
  'songs.$.url': {
    type: String,
    required: true,
    regEx: _simplSchema.default.RegEx.Url
  },
  'songs.$.approved': {
    type: Boolean
  },
  title: {
    label: 'Title Screen',
    customType: 'textarea',
    placeholder: 'Title Screen COPY (Optional)',
    type: String
  },
  cta: {
    type: String,
    label: 'CTA',
    customType: 'textarea',
    placeholder: 'CTA COPY (Optional)',
    restricted: true
  },
  clientNotes: {
    type: String,
    restricted: true,
    customType: 'textarea'
  },
  adminNotes: {
    restricted: true,
    type: String,
    customType: 'textarea'
  },
  approvedCutId: {
    // id of song file for this deliverable
    restricted: true,
    type: String
  }
});
DeliverableSchema.extend(_firstcutSchema.BaseSchema);
var _default = DeliverableSchema;
exports.default = _default;