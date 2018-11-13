
import React from 'react';
import { Segment } from 'semantic-ui-react';

function ProjectCard(props) {
  const { title, description, exampleUrl } = props;
  return (
    <Segment vertical>
      {' '}
      {title}
      {' '}
    </Segment>
  );
}

export default ProjectCard;
