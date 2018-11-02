
import { SimpleSchemaWrapper as Schema, BaseSchema } from 'firstcut-schema';

const MessageSchema = new Schema({
  authorId: String,
  text: String,
  readBy: Array,
  'readBy.$': String,
  projectId: String,
});

MessageSchema.extend(BaseSchema);

export default MessageSchema;
