
import { SimpleSchemaWrapper as Schema, BaseSchema } from 'firstcut-schema';

const MessageSchema = new Schema({
  author: String,
  content: String,
  readBy: Array,
  'readBy.$': String,
});

MessageSchema.extends(BaseSchema);

export default MessageSchema;
