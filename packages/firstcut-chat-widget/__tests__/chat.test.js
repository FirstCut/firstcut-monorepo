
jest.mock('react-chat-widget', () => ({
  Widget() {},
  addResponseMessage: jest.fn(),
  addUserMessage: jest.fn(),
  dropMessages: jest.fn(),
}));

import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { _ } from 'lodash';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import ChatWidget from '../src';

describe('<ChatWidget />', () => {
  const user = { _id: 'userid', displayName: 'user name' };
  const responder = { _id: 'responderid', displayName: 'responder name' };
  const numMessagesFromUser = 2;
  const numResponseMessages = 3;
  const userMessages = _.times(numMessagesFromUser, () => ({
    getAuthor() { return user; },
    getText() { return 'text'; },
    getAuthorId() { return this.authorId; },
    getReadBy() { return this.readBy; },
    authorId: user._id,
    readBy: [],
  }));

  const responderMessages = _.times(numResponseMessages, () => ({
    getAuthor() { return responder; },
    getText() { return 'text'; },
    getAuthorId() { return this.authorId; },
    getReadBy() { return this.readBy; },
    authorId: responder._id,
    readBy: [],
  }));
  const messages = _.concat(responderMessages, userMessages);
  const title = 'title';
  const handleNewUserMessage = jest.fn();
  const onMessagesRead = jest.fn();
  const chatComponent = (
    <ChatWidget
      messages={messages}
      handleNewUserMessage={handleNewUserMessage}
      onMessagesRead={onMessagesRead}
      title={title}
      userId={user._id}
    />
  );

  const wrapper = shallow(chatComponent);
  const widget = wrapper.find(Widget);

  test('should render the widget', () => {
    expect(widget).toHaveLength(1);
  });

  test('should render the widget with the title', () => {
    expect(widget.props().title).toBe(title);
  });

  test('should have the number of unread messages as the badge', () => {
    expect(widget.props().badge).toBe(numMessagesFromUser + numResponseMessages);
  });

  test('should have called addUserMessage', () => {
    expect(addUserMessage).toHaveBeenCalledTimes(numMessagesFromUser);
  });

  test('should have called addResponseMessage', () => {
    expect(addResponseMessage).toHaveBeenCalledTimes(numResponseMessages);
  });

  test('should call onMessagesRead once the launcher is clicked', () => {
    wrapper.simulate('click');
    expect(onMessagesRead).toHaveBeenCalledWith(messages);
  });

  test('should call addResponseMessage once when a new response message is added to the conversation', () => {
    addResponseMessage.mockReset();
    const newMessages = _.concat(messages, [{
      getAuthor() { return responder; },
      getAuthorId() { return this.authorId; },
      getReadBy() { return this.readBy; },
      authorId: responder._id,
      readBy: [],
      getText() { return 'new message'; },
    }]);
    wrapper.setProps({
      messages: newMessages, title, handleNewUserMessage, userId: user._id,
    });
    expect(addResponseMessage).toHaveBeenCalledTimes(1);
  });

  test('should lower the badge number when messages are marked as readBy', () => {
    const newMessages = [...messages];
    newMessages[0].readBy.push(user._id);
    const newWidget = shallow((
      <ChatWidget
        messages={newMessages}
        handleNewUserMessage={handleNewUserMessage}
        onMessagesRead={onMessagesRead}
        title={title}
        userId={user._id}
      />
    ));
    expect(newWidget.find(Widget).props().badge).toBe(numMessagesFromUser + numResponseMessages - 1);
  });
});
