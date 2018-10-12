import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';

function ListViewTabs(props) {
  const { panes } = props;
  return <Tab menu={{ pointing: true, secondary: true }} panes={panes} />;
}

export default ListViewTabs;
