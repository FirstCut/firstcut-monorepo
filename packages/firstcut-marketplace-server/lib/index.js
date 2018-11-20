"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _firstcutProjectTemplates = require("firstcut-project-templates");

var _firstcutProjectRequests = require("firstcut-project-requests");

var _lodash = require("lodash");

var _mongodb = require("mongodb");

var _apolloServer = require("apollo-server");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  type Query {\n    _empty: String\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var baseQuery = (0, _apolloServer.gql)(_templateObject());
var resolvers = (0, _lodash.merge)(resolvers, _firstcutProjectRequests.resolvers, _firstcutProjectTemplates.resolvers);
var server = new _apolloServer.ApolloServer({
  typeDefs: [baseQuery, _firstcutProjectTemplates.typeDefs, _firstcutProjectRequests.typeDefs],
  resolvers: resolvers,
  tracing: true,
  cacheControl: true
});
var url = process.env.MONGO_URL;
var dbName = 'firstcut-dev';

_mongodb.MongoClient.connect(url, function (err, client) {
  var db = client.db(dbName);
  (0, _firstcutProjectTemplates.init)(db.collection('project_templates'));
  (0, _firstcutProjectRequests.init)(db.collection('project_requests'));
});

server.listen({
  port: 4000
}).then(function () {
  return console.log("Running at http://localhost:4000".concat(server.graphqlPath));
});