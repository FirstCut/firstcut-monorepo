import { resolvers as templateResolvers, typeDefs as templateTypeDefs, init as initProjectTemplates } from 'firstcut-project-templates';
import { resolvers as requestResolvers, typeDefs as requestTypeDefs, init as initRequests } from 'firstcut-project-requests';
import { merge } from 'lodash';
import { MongoClient } from 'mongodb';
import { ApolloServer, gql } from 'apollo-server';

const baseQuery = gql`
  type Query {
    _empty: String
  }
`;

const resolvers = merge(resolvers, requestResolvers, templateResolvers);
const server = new ApolloServer({
  typeDefs: [baseQuery, templateTypeDefs, requestTypeDefs],
  resolvers,
  tracing: true,
  cacheControl: true,
});

const url = process.env.MONGO_URL;
const dbName = 'firstcut-dev';

MongoClient.connect(url, (err, client) => {
  const db = client.db(dbName);
  initProjectTemplates(db.collection('project_templates'));
  initRequests(db.collection('project_requests'));
});

server.listen({ port: 4000 }).then(() => console.log(`Running at http://localhost:4000${server.graphqlPath}`));
