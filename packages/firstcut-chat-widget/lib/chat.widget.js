"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _lodash = require("lodash");

var _reactChatWidget = require("react-chat-widget");

var ChatWidget =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(ChatWidget, _Component);

  function ChatWidget() {
    var _getPrototypeOf2;

    var _temp, _this;

    (0, _classCallCheck2.default)(this, ChatWidget);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _possibleConstructorReturn2.default)(_this, (_temp = _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(ChatWidget)).call.apply(_getPrototypeOf2, [this].concat(args))), _this.getUnreadMessages = function () {
      var _this$props = _this.props,
          messages = _this$props.messages,
          userId = _this$props.userId;
      return _lodash._.filter(messages, function (m) {
        return !m.getReadBy().includes(userId);
      });
    }, _this.addResponse = function (message) {
      (0, _reactChatWidget.addResponseMessage)(message.getText());
    }, _this.addUserMessage = function (message) {
      (0, _reactChatWidget.addUserMessage)(message.getText());
    }, _this.populateMessages = function (messages) {
      var userId = _this.props.userId;

      _lodash._.forEach(messages, function (m, i) {
        if (m.authorId === userId) {
          _this.addUserMessage(m);
        } else {
          var previousMessage = {
            authorId: null
          };

          if (i > 0) {
            previousMessage = messages[i - 1];
          }

          if (previousMessage.authorId !== m.authorId) {
            (0, _reactChatWidget.renderCustomComponent)(UserLabelComponent, {
              message: m
            });
          }

          _this.addResponse(m);
        }
      });
    }, _this.onToggleLauncher = function () {
      var unread = _this.getUnreadMessages();

      _this.props.onMessagesRead(unread);
    }, _temp));
  }

  (0, _createClass2.default)(ChatWidget, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var messages = this.props.messages;
      (0, _reactChatWidget.dropMessages)();
      this.populateMessages(messages);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var messages = this.props.messages;
      (0, _reactChatWidget.dropMessages)();
      this.populateMessages(messages);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          title = _this$props2.title,
          subtitle = _this$props2.subtitle,
          handleNewUserMessage = _this$props2.handleNewUserMessage;
      var unread = this.getUnreadMessages().length;
      return _react.default.createElement("div", {
        onClick: this.onToggleLauncher
      }, _react.default.createElement(_reactChatWidget.Widget, {
        title: title,
        subtitle: subtitle,
        badge: unread,
        handleNewUserMessage: handleNewUserMessage
      }));
    }
  }]);
  return ChatWidget;
}(_react.Component);

ChatWidget.defaultProps = {
  title: '',
  subtitle: '',
  onMessagesRead: function onMessagesRead() {}
};

function UserLabelComponent(props) {
  var message = props.message;
  var author = message.getAuthor();
  return _react.default.createElement(_semanticUiReact.Label, {
    size: "mini",
    basic: true,
    style: {
      border: 'none',
      marginBottom: '-5px',
      marginTop: '10px'
    }
  }, _react.default.createElement(_semanticUiReact.Image, {
    avatar: true,
    spaced: "right",
    src: author.profilePicture
  }), author.displayName);
}

function getMessagePrefix(message) {
  return ''; // return `<b>${message.getAuthor().displayName}</b>:`;
}

ChatWidget.propTypes = {
  title: _propTypes.default.string,
  subtitle: _propTypes.default.string,
  userId: _propTypes.default.string.isRequired,
  onMessagesRead: _propTypes.default.func,
  handleNewUserMessage: _propTypes.default.func.isRequired,
  messages: _propTypes.default.arrayOf(_propTypes.default.shape({
    getText: _propTypes.default.func.isRequired,
    getAuthor: _propTypes.default.func.isRequired,
    getReadBy: _propTypes.default.func.isRequired
  })).isRequired
};
var _default = ChatWidget;
exports.default = _default;