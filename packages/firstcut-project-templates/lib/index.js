"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.resolvers = exports.typeDefs = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _lodash = require("lodash");

var _projectTemplates2 = _interopRequireDefault(require("./project-templates"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  type ProjectTemplate {\n    title: String\n    description: String\n    exampleUrl: String\n    exampleThumb: String\n    _id: ID\n  }\n\n  extend type Query {\n    projectTemplates: [ProjectTemplate]\n    projectTemplate(_id: ID!): ProjectTemplate\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var collection = null;

function init(c) {
  collection = c;
}

var typeDefs = (0, _graphqlTag.default)(_templateObject());
exports.typeDefs = typeDefs;
var resolvers = {
  Query: {
    projectTemplates: function projectTemplates() {
      return _projectTemplates2.default;
    },
    projectTemplate: function projectTemplate(obj, args, context, info) {
      return getTemplate({
        _id: args._id
      });
    }
  }
};
exports.resolvers = resolvers;

function getTemplate(query) {
  return _lodash._.find(_projectTemplates2.default, query);
}