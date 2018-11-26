"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _firstcutUi = require("firstcut-ui");

var _reactRouterDom = require("react-router-dom");

/**
 * ProjectList
 *
 * Displays the list of project templates in card format
 */
function ProjectList(props) {
  var projects = props.projects;
  var cards = projects.map(function (project) {
    return _react.default.createElement(ProjectCard, (0, _extends2.default)({
      key: project._id
    }, project));
  });
  return _react.default.createElement(_firstcutUi.Card.Group, {
    centered: true
  }, cards);
}

function ProjectCard(props) {
  var _id = props._id,
      title = props.title,
      exampleThumb = props.exampleThumb;
  var itemStyle = {
    marginBottom: '4em'
  };
  return _react.default.createElement(_firstcutUi.Card, {
    as: _reactRouterDom.Link,
    to: "/contact/".concat(_id),
    style: itemStyle
  }, _react.default.createElement(_firstcutUi.Image, {
    src: exampleThumb
  }), _react.default.createElement(_firstcutUi.Card.Content, null, _react.default.createElement(_firstcutUi.Card.Header, {
    color: "green"
  }, title)));
}

var _default = ProjectList;
exports.default = _default;