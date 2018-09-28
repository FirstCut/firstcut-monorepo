import { BlueprintableSchema as Schema } from '/imports/api/blueprints';
import BaseSchema from '/imports/api/schema/base.schema';
import SimpleSchema from 'simpl-schema';

const DeliverableSchema = new Schema({
  name: {
    type: String,
    placeholder: 'optional',
  },
  projectId: {
    label: 'Project',
    placeholder: 'select parent project',
    type: String,
    required: true,
    serviceDependency: 'PROJECT',
  },
  clientOwnerId: {
    type: String,
    label: 'Client Owner',
    serviceDependency: 'CLIENT',
    required: true,
  },
  postpoOwnerId: {
    type: String,
    label: 'PostProduction by',
    serviceDependency: 'COLLABORATOR',
    serviceFilter: {
      skills: {
        $elemMatch: {
          type: {
            $in: ['VIDEO_EDITING', 'MOTIONGRAPHICS'],
          },
          isQualified: true,
        },
      },
    },
  },
  assets: {
    restricted: true,
    type: Array,
    customType: 'fileArray',
  },
  'assets.$': SimpleSchema.oneOf({ // collectionfs Ids
    type: String,
  }, {
    type: Object,
    blackbox: true,
  }),
  estimatedDuration: {
    type: SimpleSchema.Integer,
    restricted: true,
    label: 'Estimated Duration (in seconds)',
    required: true,
  },
  nextCutDue: {
    restricted: true,
    type: Date,
  },
  songs: {
    restricted: true,
    type: Array,
  },
  'songs.$': {
    type: Object,
  },
  'songs.$.name': {
    type: String,
    required: true,
  },
  'songs.$.url': {
    type: String,
    required: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  'songs.$.approved': {
    type: Boolean,
  },
  title: {
    label: 'Title Screen',
    customType: 'textarea',
    placeholder: 'Title Screen COPY (Optional)',
    type: String,
  },
  cta: {
    type: String,
    label: 'CTA',
    customType: 'textarea',
    placeholder: 'CTA COPY (Optional)',
    restricted: true,
  },
  clientNotes: {
    type: String,
    restricted: true,
    customType: 'textarea',
  },
  adminNotes: {
    restricted: true,
    type: String,
    customType: 'textarea',
  },
  approvedCutId: { // id of song file for this deliverable
    restricted: true,
    type: String,
  },
});

DeliverableSchema.extend(BaseSchema);

export default DeliverableSchema;
