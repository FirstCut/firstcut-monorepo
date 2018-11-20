"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _reactApollo = require("react-apollo");

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n      {\n        projectTemplate(_id: ", ") {\n          title\n          description\n          exampleUrl\n          _id\n        }\n      }\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ProjectDetails = function ProjectDetails(_ref) {
  var projectId = _ref.projectId;
  return _react.default.createElement(_reactApollo.Query, {
    query: (0, _graphqlTag.default)(_templateObject(), projectId)
  }, function (_ref2) {
    var loading = _ref2.loading,
        error = _ref2.error,
        data = _ref2.data;
    if (loading) return _react.default.createElement("p", null, "Loading...");
    if (error) return _react.default.createElement("p", null, "Error :(");
    var project = data.project;
    var creatorOfProject = data.creatorOfProject;
    return _react.default.createElement(ProjectDetailsComponent, {
      creator: creatorOfProject,
      project: project
    });
  });
};

function ProjectDetailsComponent(props) {
  return _react.default.createElement("div", null, " project details ");
}

var _default = ProjectDetails;
exports.default = _default;