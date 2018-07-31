import {BlueprintableSchema as Schema} from 'firstcut-blueprints';
import BaseSchema from './shared/base.schema.js';
import SimpleSchema from 'simpl-schema';
import RegEx from 'firstcut-regex';

const DeliverableSchema = new Schema({
  name: {
    type: String,
    placeholder: 'optional'
  },
  projectId: {
    label: "Project",
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
      "skills": {
        $elemMatch: {
          type: {
            "$in": ['VIDEO_EDITING', "MOTIONGRAPHICS"]
          },
          isQualified: true
        }
      }
    }
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
  }),
  estimatedDuration: {
    type: SimpleSchema.Integer,
    label: 'Estimated Duration (in seconds)',
    required: true
  },
  nextCutDue: {
    type: Date
  },
  songs: {
    type: Array
  },
  "songs.$": {
    type: Object
  },
  "songs.$.name": {
    type: String,
    required: true
  },
  "songs.$.url": {
    type: String,
    required: true,
    regEx: RegEx.Url
  },
  "songs.$.approved": {
    type: Boolean
  },
  title: {
    label: "Title Screen",
    customType: 'textarea',
    placeholder: "Title Screen COPY (Optional)",
    type: String
  },
  cta: {
    type: String,
    label: "CTA",
    customType: 'textarea',
    placeholder: "CTA COPY (Optional)"
  },
  clientNotes: {
    type: String,
    customType: 'textarea'
  },
  adminNotes: {
    type: String,
    customType: 'textarea'
  },
  approvedCutId: { // id of song file for this deliverable
    type: String
  }
});

DeliverableSchema.extend(BaseSchema);
export default DeliverableSchema;
