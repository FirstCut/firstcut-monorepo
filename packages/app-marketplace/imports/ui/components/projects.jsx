
import React from 'react';
import { Embed, Item, Responsive } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function ProjectList(props) {
  const { projects } = props;
  const cards = projects.map(project => (
    <ProjectCard key={project._id} {...project} />
  ));
  return (
    <Item.Group>
      { cards }
    </Item.Group>
  );
}

function ProjectCard(props) {
  const {
    _id, title, description, exampleUrl, onClick,
  } = props;
  const desktopVideoStyle = {
    width: '400px',
    marginRight: '15px',
  };
  const mobileVideoStyle = {
    paddingBottom: '15px',
  };
  const itemStyle = {
    marginBottom: '4em',
  };
  return (
    <Item as={Link} to={`/contact/${_id}`} style={itemStyle}>
      <Responsive minWidth={768}>
        <div style={desktopVideoStyle}>
          <Embed url={exampleUrl} />
        </div>
      </Responsive>
      <Responsive maxWidth={768}>
        <div style={mobileVideoStyle}>
          <Embed url={exampleUrl} />
        </div>
      </Responsive>
      <Item.Content>
        <Item.Header>
          { title }
        </Item.Header>
        <Item.Description>
          { description }
        </Item.Description>
      </Item.Content>
    </Item>
  );
}

export default ProjectList;
