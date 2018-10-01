import { BlueprintableSchema as Schema } from '/imports/api/blueprints';
import { STAGES } from './projects.enum';
import BaseSchema from 'firstcut-schema';
import SimpleSchema from 'simpl-schema';

const ProjectSchema = new Schema({
  isDummy: {
    type: Boolean,
  },
  name: {
    type: String,
    required: true,
    label: 'Project Name',
  },
  salesforceId: {
    type: String,
  },
  clientOwnerId: {
    type: String,
    required: true,
    label: 'Client Owner',
    serviceDependency: 'CLIENT',
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
          isQualified: true,
        },
      },
    },
  },
  stage: {
    type: String,
    enumOptions: STAGES,
    sortBy: 'off',
  },
  additionalClientTeamMemberIds: {
    type: Array,
    label: 'Additional Client Team Members',
    customType: 'multiselect',
    serviceDependency: 'CLIENT',
  },
  'additionalClientTeamMemberIds.$': {
    type: String,
  },
  companyId: {
    type: String,
    label: 'Company',
    required: true,
    serviceDependency: 'COMPANY',
  },
  SOWFile: {
    type: String,
    label: 'SOW File',
    customType: 'file',
  },
  notes: {
    type: String,
    customType: 'textarea',
  },
  invoiceAmount: {
    type: Number,
  },
  executiveProducer: {
    type: String,
    serviceDependency: 'Collaborator',
  },
  producerHours: {
    type: Number,
  },
  projectArchive: {
    type: Array,
    customType: 'fileArray',
  },
  'projectArchive.$': {
    type: String,
  },
  assets: {
    type: Array,
    customType: 'fileArray',
  },
  'assets.$': SimpleSchema.oneOf({ // collectionfs Ids
    type: String,
  }, {
    type: Object,
    blackbox: true,
  }),
});

ProjectSchema.extend(BaseSchema);

export default ProjectSchema;
