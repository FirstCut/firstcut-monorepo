"use strict";

var _require = require('apollo-server-express'),
    ApolloServer = _require.ApolloServer;

var _require2 = require('firstcut-project-templates'),
    resolvers = _require2.resolvers,
    typeDefs = _require2.typeDefs;

var express = require('express');

var app = express();
var server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  tracing: true,
  cacheControl: true
});
server.applyMiddleware({
  app: app
});
app.listen({
  port: 4000
}, function () {
  return console.log("Running at http://localhost:4000".concat(server.graphqlPath));
});