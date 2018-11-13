import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ProjectCard from '../components/project.card';

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

      return data.projects.map(project => (
        <ProjectCard key={project.title} {...project} />
      ));
    }}
  </Query>
);

export default ExploreMarketplacePage;
