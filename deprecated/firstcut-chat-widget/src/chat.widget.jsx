import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Image } from 'semantic-ui-react';
import { _ } from 'lodash';
import {
  Widget, addResponseMessage, addUserMessage, dropMessages, renderCustomComponent,
} from 'react-chat-widget';

class ChatWidget extends Component {
  static defaultProps = {
    title: '',
    subtitle: '',
    onMessagesRead() {},
  }

  componentDidMount() {
    const { messages } = this.props;
    dropMessages();
    this.populateMessages(messages);
  }

  componentDidUpdate(prevProps, prevState) {
    const { messages } = this.props;
    dropMessages();
    this.populateMessages(messages);
  }

   getUnreadMessages = () => {
     const { messages, userId } = this.props;
     return _.filter(messages, m => !m.getReadBy().includes(userId));
   }

   addResponse = (message) => {
     addResponseMessage(message.getText());
   }

   addUserMessage = (message) => {
     addUserMessage(message.getText());
   }

   populateMessages = (messages) => {
     const { userId } = this.props;
     _.forEach(messages, (m, i) => {
       if (m.authorId === userId) {
         this.addUserMessage(m);
       } else {
         let previousMessage = { authorId: null };
         if (i > 0) {
           previousMessage = messages[i - 1];
         }
         if (previousMessage.authorId !== m.authorId) {
           renderCustomComponent(UserLabelComponent, { message: m });
         }
         this.addResponse(m);
       }
     });
   }

   onToggleLauncher = () => {
     const unread = this.getUnreadMessages();
     this.props.onMessagesRead(unread);
   }

   render() {
     const { title, subtitle, handleNewUserMessage } = this.props;
     const unread = this.getUnreadMessages().length;
     return (
       <div onClick={this.onToggleLauncher}>
         <Widget
           title={title}
           subtitle={subtitle}
           badge={unread}
           handleNewUserMessage={handleNewUserMessage}
         />
       </div>
     );
   }
}

function UserLabelComponent(props) {
  const { message } = props;
  const author = message.getAuthor();
  return (
    <Label size="mini" basic style={{ border: 'none', marginBottom: '-5px', marginTop: '10px' }}>
      <Image avatar spaced="right" src={author.profilePicture} />
      { author.displayName }
    </Label>
  );
}

function getMessagePrefix(message) {
  return '';
  // return `<b>${message.getAuthor().displayName}</b>:`;
}

ChatWidget.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
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
