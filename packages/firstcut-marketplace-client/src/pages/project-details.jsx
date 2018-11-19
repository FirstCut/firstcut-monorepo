import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ProjectList from '../components/projects';

const ProjectDetails = ({ projectId }) => (
  <Query
    query={gql`
      {
        project(_id: ${projectId}) {
          title
          description
          exampleUrl
          _id
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      const { project } = data;
      const { creatorOfProject } = data;
      return (
        <ProjectDetailsComponent
          creator={creatorOfProject}
          project={project}
        />
      );
    }}
  </Query>
);

function ProjectDetailsComponent(props) {
  return <div> project details </div>;
}
export default ProjectDetails;
