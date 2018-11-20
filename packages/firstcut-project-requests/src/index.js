
import { gql } from 'apollo-server';

let collection = null;
function init(c) {
  collection = c;
}

const typeDefs = gql`
  type ProjectRequest {
    firstName: String
    lastName: String
    email: String
    about: String
    projectId: String
    location: String
    budget: String
    company: String
    website: String
    _id: ID
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  extend type Query {
    requests: [ProjectRequest]
  }

  type Mutation {
    addRequest(
      firstName: String!,
      lastName: String!,
      email: String!,
      company: String,
      website: String,
      location: String,
      budget: String
      about: String
    ): ProjectRequest
  }
`;

const resolvers = {
  Query: {
    requests: () => findRequests({}),
  },
  Mutation: {
    addRequest: (root, args) => {
      saveRequest(args);
    },
  },
};

function saveRequest(request) {
  collection.insertOne(request);
}

function findRequests(query) {
  return new Promise((resolve, reject) => collection.find(query).toArray((err, docs) => {
    if (err) {
      reject(err);
    }
    resolve(docs);
  }));
}

export { typeDefs, resolvers, init };
