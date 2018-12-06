
import { resolvers as templateResolvers, typeDefs as templateTypeDefs } from 'firstcut-project-templates';
import { resolvers as requestResolvers, typeDefs as requestTypeDefs } from 'firstcut-project-requests';
import { merge } from 'lodash';
import { GraphQLServer } from 'graphql-yoga';
import { makeExecutableSchema } from 'graphql-tools';
import gql from 'graphql-tag';
import { applyMiddleware } from 'graphql-middleware';
import handleEvent, { EVENTS } from 'firstcut-event-handler';

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

// export the server for testing
export default server;
