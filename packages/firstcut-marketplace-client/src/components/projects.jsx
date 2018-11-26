
import React from 'react';
import { Image, Card } from 'firstcut-ui';
import { Link } from 'react-router-dom';

/**
 * ProjectList
 *
 * Displays the list of project templates in card format
 */

function ProjectList(props) {
  const { projects } = props;
  const cards = projects.map(project => (
    <ProjectCard key={project._id} {...project} />
  ));
  return (
    <Card.Group centered>
      { cards }
    </Card.Group>
  );
}

function ProjectCard(props) {
  const {
    _id, title, exampleThumb,
  } = props;
  const itemStyle = {
    marginBottom: '4em',
  };
  return (
    <Card as={Link} to={`/contact/${_id}`} style={itemStyle}>
      <Image src={exampleThumb} />
      <Card.Content>
        <Card.Header color="green">
          { title }
        </Card.Header>
      </Card.Content>
    </Card>
  );
}

export default ProjectList;
