
import { createBaseModel } from 'firstcut-model-base';
import MessageSchema from './message.schema';

const Base = createBaseModel(MessageSchema);

class Message extends Base {
  static get collectionName() { return 'messages'; }

  static get schema() { return MessageSchema; }

  getAuthor() {
    return this.getPlayerFromQuery({ _id: this.authorId });
  }

  getText() {
    return this.text;
  }

  getReadBy() {
    return this.readBy;
  }
}

export default Message;
