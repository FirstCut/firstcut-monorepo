import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'firstcut-ui';

/**
 * Alert
 *
 * Displays an alert to the user
 */

function Alert(props) {
  const { header, message, visible=true } = props;
  return (<Modal open={visible} header={props.header} content={props.message}/>);
}

Alert.propTypes = {
  message: PropTypes.string,
  header: PropTypes.string,
  visible: PropTypes.bool
}

export default Alert;
