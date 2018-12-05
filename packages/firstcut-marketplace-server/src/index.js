import { resolvers as templateResolvers, typeDefs as templateTypeDefs, init as initProjectTemplates } from 'firstcut-project-templates';
import { resolvers as requestResolvers, typeDefs as requestTypeDefs, init as initRequests } from 'firstcut-project-requests';
import { merge } from 'lodash';
import { MongoClient } from 'mongodb';
import { GraphQLServer } from 'graphql-yoga';
import { makeExecutableSchema } from 'graphql-tools';
import gql from 'graphql-tag';
import { applyMiddleware } from 'graphql-middleware';
import handleEvent, { EVENTS } from 'firstcut-event-handler';
import config from './config';

const {
  PORT, ENV, GRAPHQL_ENDPOINT, MONGO_URL, DB_NAME,
} = config;

const baseQuery = gql`
  type Query {
    _empty: String
  }
`;

const resolvers = merge(resolvers, requestResolvers, templateResolvers);

const eventMiddleware = {
  Query: {
    projectTemplates: async (resolve, parent, args, context, info) => {
      const result = await resolve(parent, args, context, info);
      return result;
    },
  },
  Mutation: {
    addRequest: async (resolve, parent, args, context, info) => {
      handleEvent({ event: EVENTS.PROJECT_REQUEST, ...args });
      const result = await resolve(parent, args, context, info);
      return result;
    },
  },

};

const schema = makeExecutableSchema({
  typeDefs: [baseQuery, templateTypeDefs, requestTypeDefs],
  resolvers,
});

const withMiddleware = applyMiddleware(
  schema,
  eventMiddleware,
);

const server = new GraphQLServer({
  schema: withMiddleware,
});

const options = {
  port: PORT,
  playground: ENV === 'development',
  endpoint: GRAPHQL_ENDPOINT,
};

server.start(options, () => console.log(
  '🚀 Server ready at', PORT,
));

MongoClient.connect(MONGO_URL, (err, client) => {
  const db = client.db(DB_NAME);
  initProjectTemplates(db.collection('project_templates'));
  initRequests(db.collection('project_requests'));
});

// export the server for testing
export default server;
