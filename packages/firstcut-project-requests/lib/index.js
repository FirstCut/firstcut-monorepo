"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.resolvers = exports.typeDefs = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _apolloServer = require("apollo-server");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  type ProjectRequest {\n    firstName: String\n    lastName: String\n    email: String\n    about: String\n    projectId: String\n    location: String\n    budget: String\n    company: String\n    website: String\n    _id: ID\n  }\n\n  # The \"Query\" type is the root of all GraphQL queries.\n  # (A \"Mutation\" type will be covered later on.)\n  extend type Query {\n    requests: [ProjectRequest]\n  }\n\n  type Mutation {\n    addRequest(\n      firstName: String!,\n      lastName: String!,\n      email: String!,\n      company: String,\n      website: String,\n      location: String,\n      budget: String\n      about: String\n    ): ProjectRequest\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var collection = null;

function init(c) {
  collection = c;
}

var typeDefs = (0, _apolloServer.gql)(_templateObject());
exports.typeDefs = typeDefs;
var resolvers = {
  Query: {
    requests: function requests() {
      return findRequests({});
    }
  },
  Mutation: {
    addRequest: function addRequest(root, args) {
      saveRequest(args);
    }
  }
};
exports.resolvers = resolvers;

function saveRequest(request) {
  collection.insertOne(request);
}

function findRequests(query) {
  return new Promise(function (resolve, reject) {
    return collection.find(query).toArray(function (err, docs) {
      if (err) {
        reject(err);
      }

      resolve(docs);
    });
  });
}