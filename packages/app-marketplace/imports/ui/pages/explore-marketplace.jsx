import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ProjectList from '../components/projects';

const ExploreMarketplacePage = () => (
  <Query
    query={gql`
      {
        projects {
          title
          description
          exampleUrl
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return <ProjectList projects={data.projects} />;
    }}
  </Query>
);

export default ExploreMarketplacePage;
