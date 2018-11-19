
import { gql } from 'apollo-server-express';
import { _ } from 'lodash';
import projectTemplates from './project-templates';

const typeDefs = gql`
  type ProjectTemplate {
    title: String
    description: String
    exampleUrl: String
    exampleThumb: String
    _id: ID
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    projectTemplates: [ProjectTemplate]
    projectTemplate(_id: ID!): ProjectTemplate
  }
`;

const resolvers = {
  Query: {
    projectTemplates: () => projectTemplates,
    projectTemplate: (obj, args, context, info) => getProject({ _id: args._id }),
  },
};

function getProject(query) {
  return _.find(projectTemplates, query);
}

export { typeDefs, resolvers };
