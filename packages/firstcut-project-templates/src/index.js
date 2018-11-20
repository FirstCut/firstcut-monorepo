
import { gql } from 'apollo-server';
import { _ } from 'lodash';
import projectTemplates from './project-templates';

let collection = null;
function init(c) {
  collection = c;
}

const typeDefs = gql`
  type ProjectTemplate {
    title: String
    description: String
    exampleUrl: String
    exampleThumb: String
    _id: ID
  }

  extend type Query {
    projectTemplates: [ProjectTemplate]
    projectTemplate(_id: ID!): ProjectTemplate
  }
`;

const resolvers = {
  Query: {
    projectTemplates: () => projectTemplates,
    projectTemplate: (obj, args, context, info) => getTemplate({ _id: args._id }),
  },
};

function getTemplate(query) {
  return _.find(projectTemplates, query);
}

export { typeDefs, resolvers, init };
