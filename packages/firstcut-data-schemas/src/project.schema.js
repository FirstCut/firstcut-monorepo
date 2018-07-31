import {BlueprintableSchema as Schema} from 'firstcut-blueprints';
import {PROJECT_STAGES} from 'firstcut-enum';
import BaseSchema from './shared/base.schema.js';
import SimpleSchema from 'simpl-schema';

const ProjectSchema = new Schema({
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
    enumOptions: PROJECT_STAGES,
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
  "assets.$": SimpleSchema.oneOf({ //collectionfs Ids
    type: String
  }, {
    type: Object,
    blackbox: true
  })
});

ProjectSchema.extend(BaseSchema);

export default ProjectSchema;
