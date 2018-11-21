import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'firstcut-ui';

function Alert(props) {
  return (<Modal header={props.header} content={props.message}/>);
}

Alert.propTypes = {
  message: PropTypes.string,
  header: PropTypes.string
}

export default Alert;
