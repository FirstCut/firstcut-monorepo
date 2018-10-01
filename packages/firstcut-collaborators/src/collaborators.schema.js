import SimpleSchema from 'simpl-schema';
import {
  SimpleSchemaWrapper as Schema, LocationSchema, ProfileSchema, BaseSchema,
} from 'firstcut-schema';
import { COLLABORATOR_TYPES, PAYMENT_METHODS, COLLABORATOR_SKILLS } from './collaborators.enum';

const CollaboratorSchema = new Schema({
  type: { // TODO: we should remove this all together righ LUCY?
    type: String,
    label: 'Type',
    enumOptions: COLLABORATOR_TYPES,
    restricted: true,
  },
  activeShootId: {/* TODO: make this a helper that refers to the status of shoot */
    type: String,
    restricted: true,
  },
  applicationNotes: {
    type: String,
    customType: 'textarea',
    label: 'Tell us more about yourself',
    restricted: true,
  },
  portfolioUrl: {
    type: String,
    optional: true,
    restricted: true,
  },
  isActive: {
    type: Boolean,
    label: 'isActive',
  },
  taxCompliant: {
    type: Boolean,
    restricted: true,
  },
  skills: {
    type: Array,
  },
  'skills.$': {
    type: Object,
  },
  'skills.$.type': {
    type: String,
    required: true,
    enumOptions: COLLABORATOR_SKILLS,
  },
  'skills.$.isQualified': {
    type: Boolean,
  },
  'skills.$.rating': {
    type: SimpleSchema.Integer,
  },
  paymentMethod: {
    type: Array,
    restricted: true,
  },
  'paymentMethod.$': {
    type: Object,
  },
  'paymentMethod.$.type': {
    type: String,
    required: true,
    enumOptions: PAYMENT_METHODS,
  },
  'paymentMethod.$.accountEmail': {
    type: String,
  },
});

CollaboratorSchema.extend(BaseSchema);
CollaboratorSchema.extend(ProfileSchema);
CollaboratorSchema.extend(LocationSchema);

export default CollaboratorSchema;
