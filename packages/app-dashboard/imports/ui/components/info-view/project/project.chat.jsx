
import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
  Portal,
} from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { userPlayerId } from 'firstcut-user-session';
import { _ } from 'lodash';
import ChatWidget from 'firstcut-chat-widget';

export default withTracker((props) => {
  const { project } = props;
  const handle = Meteor.subscribe('project.messages', project._id);
  const messages = project.getProjectMessages().toArray();
  return { project, messages };
})(ProjectChatWindow);

function ProjectChatWindow(props) {
  const { project, messages } = props;
  // const messages = project.getProjectMessages().toArray();
  return (
    <Portal open>
      <ChatWidget
        messages={messages}
        handleNewUserMessage={addNewMessage(project)}
        onMessagesRead={markMessagesAsRead}
        title="Project Chat"
        subtitle="Chat with your producer here"
        userId={userPlayerId()}
      />
    </Portal>);
}

function markMessagesAsRead(messages) {
  _.forEach(messages, (m) => {
    const readBy = m.readBy;
    readBy.push(userPlayerId());
    m = m.set('readBy', readBy);
    m.save();
  });
}

function addNewMessage(record) {
  return function _addMessage(text) {
    const message = record.messageService.createNew({
      text,
      projectId: record._id,
      authorId: userPlayerId(),
      readBy: [userPlayerId()],
    });
    message.save();
  };
}
