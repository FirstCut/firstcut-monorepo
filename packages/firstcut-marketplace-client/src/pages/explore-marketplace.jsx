import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Container } from 'firstcut-ui';
import ProjectList from '../components/projects';

const ExploreMarketplacePage = () => (
  <Query
    query={gql`
      {
        projectTemplates {
          title
          description
          exampleThumb
          exampleUrl
          _id
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return (
        <Container style={{ paddingTop: '100px' }}>
          <ProjectList projects={data.projectTemplates} />
        </Container>
      );
    }}
  </Query>
);

export default ExploreMarketplacePage;
