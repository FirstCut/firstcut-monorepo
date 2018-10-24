
import { SimpleSchemaWrapper as Schema, BaseSchema } from 'firstcut-schema';

const ConversationSchema = new Schema({
  participantIds: Array,
  'participantIds.$': String,
});

ConversationSchema.extends(BaseSchema);

export default ConversationSchema;
