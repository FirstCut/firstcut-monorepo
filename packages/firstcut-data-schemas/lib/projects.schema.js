"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firstcutBlueprints = require("firstcut-blueprints");

var _projectsEnum = require("./projects.enum.js");

var _baseSchema = _interopRequireDefault(require("./shared/base.schema.js"));

var _simplSchema = _interopRequireDefault(require("simpl-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProjectSchema = new _firstcutBlueprints.BlueprintableSchema({
  "isDummy": {
    type: Boolean
  },
  name: {
    type: String,
    required: true,
    label: "Project Name"
  },
  clientOwnerId: {
    type: String,
    required: true,
    label: "Client Owner",
    serviceDependency: 'CLIENT'
  },
  adminOwnerId: {
    type: String,
    label: "Admin Owner",
    required: true,
    serviceDependency: 'COLLABORATOR',
    serviceFilter: {
      "skills": {
        $elemMatch: {
          type: 'VIDEO_PROJECT_MANAGEMENT',
          isQualified: true
        }
      }
    }
  },
  "stage": {
    type: String,
    defaultValue: "BOOKING",
    required: true,
    enumOptions: _projectsEnum.PROJECT_STAGES,
    sortBy: 'off'
  },
  companyId: {
    type: String,
    label: "Company",
    required: true,
    serviceDependency: 'COMPANY'
  },
  assets: {
    type: Array,
    customType: 'fileArray'
  },
  "assets.$": _simplSchema.default.oneOf({
    //collectionfs Ids
    type: String
  }, {
    type: Object,
    blackbox: true
  })
});
ProjectSchema.extend(_baseSchema.default);
var _default = ProjectSchema;
exports.default = _default;