import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Container } from 'firstcut-ui';
import ProjectList from '../components/projects';
import Loading from '../components/loading';
import Alert from '../components/alert';

/**
 * ExploreMarketplacePage
 * 
 * Queries the graphql api for project templates and displays them.
 */

export const GET_PROJECT_TEMPLATES_QUERY = gql`
  {
    projectTemplates {
      title
      description
      exampleThumb
      exampleUrl
      _id
    }
  }
`;

const ExploreMarketplacePage = () => (
  <Query query={GET_PROJECT_TEMPLATES_QUERY}>
    {({ loading, error, data }) => {
      if (loading) return <Loading/>
      if (error) return <Alert message={error.message} />;

      return (
        <Container style={{ paddingTop: '100px' }}>
          <ProjectList projects={data.projectTemplates} />
        </Container>
      );
    }}
  </Query>
);

export default ExploreMarketplacePage;
