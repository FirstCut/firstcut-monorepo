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

var _firstcutUi = require("firstcut-ui");

var _projects = _interopRequireDefault(require("../components/projects"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n      {\n        projectTemplates {\n          title\n          description\n          exampleThumb\n          exampleUrl\n          _id\n        }\n      }\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ExploreMarketplacePage = function ExploreMarketplacePage() {
  return _react.default.createElement(_reactApollo.Query, {
    query: (0, _graphqlTag.default)(_templateObject())
  }, function (_ref) {
    var loading = _ref.loading,
        error = _ref.error,
        data = _ref.data;
    if (loading) return _react.default.createElement("p", null, "Loading...");
    if (error) return _react.default.createElement("p", null, "Error :(");
    return _react.default.createElement(_firstcutUi.Container, {
      style: {
        paddingTop: '100px'
      }
    }, _react.default.createElement(_projects.default, {
      projects: data.projectTemplates
    }));
  });
};

var _default = ExploreMarketplacePage;
exports.default = _default;