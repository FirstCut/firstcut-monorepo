const { ApolloServer } = require('apollo-server-express');
const { resolvers, typeDefs } = require('firstcut-project-templates');
const express = require('express');

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  cacheControl: true,
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`Running at http://localhost:4000${server.graphqlPath}`));
