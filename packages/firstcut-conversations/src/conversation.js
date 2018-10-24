
import { createBaseModel } from 'firstcut-model-base';
import { _ } from 'lodash';
import ConversationSchema from './conversation.schema';

const Base = createBaseModel(ConversationSchema);

class Conversation extends Base {
  static get collectionName() { return 'conversations'; }

  static get schema() { return ConversationSchema; }

  getMessages() {
    const messages = this.messageService.find({ conversationId: this._id });
    return _.sort(messages, ['createdAt']);
  }
}

export default Conversation;
