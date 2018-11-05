import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import {
  Widget, addResponseMessage, addUserMessage, dropMessages, renderCustomComponent,
} from 'react-chat-widget';

class ChatWidget extends Component {
  static defaultProps = {
    title: '',
    onMessagesRead() {},
  }

  componentDidMount() {
    const { messages } = this.props;
    dropMessages();
    this.populateMessages(messages);
  }

  componentDidUpdate(prevProps, prevState) {
    const { messages } = this.props;
    const newMessages = _.drop(messages, prevProps.messages.length);
    if (newMessages.length > 0) {
      this.populateMessages(newMessages);
    }
  }

   getUnreadMessages = () => {
     const { messages, userId } = this.props;
     return _.filter(messages, m => !m.getReadBy().includes(userId));
   }

   addResponse = (message) => {
     const prefix = getMessagePrefix(message);
     addResponseMessage(`${prefix} ${message.getText()}`);
   }

   addUserMessage = (message) => {
     const prefix = getMessagePrefix(message);
     renderCustomComponent(MessageComponent, {}, true);
     addUserMessage(`${prefix} ${message.getText()}`);
   }

   populateMessages = (messages) => {
     const { userId } = this.props;
     _.forEach(messages, (m) => {
       if (m.authorId === userId) {
         this.addUserMessage(m);
       } else {
         this.addResponse(m);
       }
     });
   }

   onToggleLauncher = () => {
     const unread = this.getUnreadMessages();
     this.props.onMessagesRead(unread);
   }

   render() {
     const { title, handleNewUserMessage } = this.props;
     const unread = this.getUnreadMessages().length;
     return (
       <div onClick={this.onToggleLauncher}>
         <Widget
           title={title}
           badge={unread}
           handleNewUserMessage={handleNewUserMessage}
         />
       </div>
     );
   }
}

function MessageComponent(props) {
  return <div>HELLO</div>;
}

function getMessagePrefix(message) {
  return `<b>${message.getAuthor().displayName}</b>:`;
}

ChatWidget.propTypes = {
  title: PropTypes.string,
  userId: PropTypes.string.isRequired,
  onMessagesRead: PropTypes.func,
  handleNewUserMessage: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    getText: PropTypes.func.isRequired,
    getAuthor: PropTypes.func.isRequired,
    getReadBy: PropTypes.func.isRequired,
  })).isRequired,
};
export default ChatWidget;
