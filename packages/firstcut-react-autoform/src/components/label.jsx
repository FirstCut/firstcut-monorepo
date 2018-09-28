
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Popup } from 'semantic-ui-react';

export default function Label(props) {
  let {label, helpText, error} = {...props};
  label = (error)? (label + " -- " + error) : label;
  return (
    <div>
      {label}
      { helpText &&
        <Popup trigger={<Icon name='question circle'/>}> {helpText} </Popup>
      }
    </div>
  )
}

Label.propTypes = {
  label: PropTypes.string,
  error: PropTypes.array,
  helpText: PropTypes.string
}
