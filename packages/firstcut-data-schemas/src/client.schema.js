
import { FCSchema as Schema } from 'firstcut-schema-builder';
import BaseSchema from './shared/base.schema.js';
import ProfileSchema from './shared/profile.schema.js';
import LocationSchema from './shared/location.schema.js';

const ClientSchema = new Schema({
  companyId: {
    type: String,
		serviceDependency: 'COMPANY',
    label: 'Company',
    required: true,
  },
});

ClientSchema.extend(BaseSchema);
ClientSchema.extend(ProfileSchema);
ClientSchema.extend(LocationSchema);

export default ClientSchema;
