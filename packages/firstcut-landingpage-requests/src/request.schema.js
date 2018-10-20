
import { BaseSchema, SimpleSchemaWrapper as Schema } from 'firstcut-schema';

const RequestSchema = new Schema({
  _id: String,
  adId: String,
  first: String,
  last: String,
  email: String,
  about: String,
  company: String,
});

RequestSchema.extend(BaseSchema);
export default RequestSchema;
