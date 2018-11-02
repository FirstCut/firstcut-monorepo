import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
// import { PubSub } from 'pubsub-js';
import { _ } from 'lodash';

// import 'react-chat-widget/lib/styles.css';

class ChatWidget extends Component {
  static defaultProps = {
    title: '',
    onMessagesRead() {},
  }

  componentDidMount() {
    const { messages } = this.props;
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
       <Widget
         title={title}
         profileAvatar="/firstcut_logo.png"
         badge={unread}
         handleNewUserMessage={handleNewUserMessage}
         fullScreenMode
         showCloseButton
         onClick={this.onToggleLauncher}
       />
     );
   }
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
