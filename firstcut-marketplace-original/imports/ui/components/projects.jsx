
import React from 'react';
import { Image, Card, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function ProjectList(props) {
  const { projects } = props;
  const cards = projects.map(project => (
    <ProjectCard key={project._id} {...project} />
  ));
  return (
    <Card.Group>
      { cards }
    </Card.Group>
  );
}

function ProjectCard(props) {
  const {
    _id, title, description, exampleThumb, onClick,
  } = props;
  // const desktopVideoStyle = {
  //   width: '400px',
  //   marginRight: '15px',
  // };
  // const mobileVideoStyle = {
  //   paddingBottom: '15px',
  // };
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
