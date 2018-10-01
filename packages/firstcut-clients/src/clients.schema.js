
import { SimpleSchemaWrapper as Schema } from 'firstcut-schema';
import BaseSchema from 'firstcut-schema';
import ProfileSchema from 'firstcut-schema';
import LocationSchema from 'firstcut-schema';

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
