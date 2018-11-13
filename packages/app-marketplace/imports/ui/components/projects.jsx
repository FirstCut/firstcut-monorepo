
import React from 'react';
import { Embed, Item, Responsive } from 'semantic-ui-react';

function ProjectList(props) {
  const { projects } = props;
  const cards = projects.map(project => (
    <ProjectCard key={project.title} {...project} />
  ));
  return (
    <Item.Group>
      { cards }
    </Item.Group>
  );
}

function ProjectCard(props) {
  const { title, description, exampleUrl } = props;
  const desktopVideoStyle = {
    width: '300px',
    marginRight: '15px',
  };
  const mobileVideoStyle = {
    paddingBottom: '15px',
  };
  return (
    <Item>

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
