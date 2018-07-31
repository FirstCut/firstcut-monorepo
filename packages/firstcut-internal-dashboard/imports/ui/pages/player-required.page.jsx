
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Container } from 'semantic-ui-react';

export default function PlayerPermissionsRequired(props) {
  return (
    <Container>
      <Header>
      It appears that you do not have access to this page. Please contact FirstCut at teamfirstcut@firstcut.io if you think this is an error.
      </Header>
    </Container>
  )
}
