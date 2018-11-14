
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  # This "Book" type can be used in other type declarations.
  type Creator {
    firstName: String
    lastName: String
    _id: ID
  }

  type Project {
    title: String
    description: String
    exampleUrl: String
    _id: ID
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    creators: [Creator]
    projects: [Project]
    project(_id: ID!): Project
    creatorOfProject(projectId: ID!): Creator
  }

`;

export default typeDefs;
