
import { SimpleSchemaWrapper as Schema } from '/imports/api/schema';
import BaseSchema from '/imports/api/schema/base.schema';
import ProfileSchema from '/imports/api/schema/profile.schema';
import LocationSchema from '/imports/api/schema/location.schema';

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
