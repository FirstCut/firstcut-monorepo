import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';


const ExploreMarketplacePage = () => (
  <Query
    query={gql`
      {
        projects {
          title
          description
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.projects.map(({ title, description }) => (
        <div key={title}>
          <p>{`${title}: ${description}`}</p>
        </div>
      ));
    }}
  </Query>
);

export default ExploreMarketplacePage;
