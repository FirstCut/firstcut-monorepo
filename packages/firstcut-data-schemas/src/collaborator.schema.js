import {FCSchema as Schema} from 'firstcut-schema-builder';
import SimpleSchema from 'simpl-schema';
import LocationSchema from './shared/location.schema.js';
import ProfileSchema from './shared/profile.schema.js';
import BaseSchema from './shared/base.schema.js';
import {COLLABORATOR_TYPES, PAYMENT_METHODS, COLLABORATOR_SKILLS} from 'firstcut-enum';
import RegEx from 'firstcut-regex';

const CollaboratorSchema = new Schema({
  type: { //TODO: we should remove this all together righ LUCY?
    type: String,
    label: "Type",
    enumOptions: COLLABORATOR_TYPES
  },
  "activeShootId": {/*TODO: make this a helper that refers to the status of shoot */
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
    enumOptions: COLLABORATOR_SKILLS
  },
  "skills.$.isQualified": {
    type: Boolean
  },
  "skills.$.rating": {
    type: SimpleSchema.Integer
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
    enumOptions: PAYMENT_METHODS
  },
  "paymentMethod.$.accountEmail": {
    type: String,
    regEx: RegEx.Email
  }
});

CollaboratorSchema.extend(BaseSchema);
CollaboratorSchema.extend(ProfileSchema);
CollaboratorSchema.extend(LocationSchema);

export default CollaboratorSchema;
