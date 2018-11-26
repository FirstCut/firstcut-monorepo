import { resolvers as templateResolvers, typeDefs as templateTypeDefs, init as initProjectTemplates } from 'firstcut-project-templates';
import { resolvers as requestResolvers, typeDefs as requestTypeDefs, init as initRequests } from 'firstcut-project-requests';
import { merge } from 'lodash';
import { MongoClient } from 'mongodb';
import { GraphQLServer } from 'graphql-yoga';
import { makeExecutableSchema } from 'graphql-tools';
import gql from 'graphql-tag';
import { applyMiddleware } from 'graphql-middleware';

const baseQuery = gql`
  type Query {
    _empty: String
  }
`;

const resolvers = merge(resolvers, requestResolvers, templateResolvers);

const logInput = async (resolve, root, args, context, info) => {
  const result = await resolve(root, args, context, info);
  return result;
};

const eventMiddleware = {
  Query: {
    projectTemplates: async (resolve, parent, args, context, info) => {
      console.log('PROJECT TEMP{LAtes');
      const result = await resolve(parent, args, context, info);
      return result;
    },
  },
  Mutation: {
    addRequest: async (resolve, parent, args, context, info) => {
      console.log('ADD REQUEST MIDDLEWARE');
      const result = await resolve(parent, args, context, info);
      return result;
    },
  },

};

const schema = makeExecutableSchema({ typeDefs: [baseQuery, templateTypeDefs, requestTypeDefs], resolvers });
const withMiddleware = applyMiddleware(
  schema,
  eventMiddleware,
);

const server = new GraphQLServer({
  schema: withMiddleware,
});

const port = process.env.PORT || 4000;
const playground = (process.env.NODE_ENV === 'development');
const options = {
  port,
  playground,
  endpoint: '/graphql',
};
server.start(options, () => console.log(
  '🚀 Server ready at', port,
));

const url = process.env.MONGO_URL;
const dbName = 'firstcut-dev';

MongoClient.connect(url, (err, client) => {
  const db = client.db(dbName);
  initProjectTemplates(db.collection('project_templates'));
  initRequests(db.collection('project_requests'));
});

// server.listen({ port: PORT }).then(() => console.log(`Running at http://localhost:${PORT}${server.graphqlPath}`));
