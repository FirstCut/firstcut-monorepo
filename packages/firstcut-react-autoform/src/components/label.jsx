
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Popup } from 'semantic-ui-react';

export default function Label(props) {
  let {label, help_text, error} = {...props};
  label = (error)? (label + " -- " + error) : label;
  return (
    <div>
      {label}
      { help_text &&
        <Popup trigger={<Icon name='question circle'/>}> {help_text} </Popup>
      }
    </div>
  )
}

Label.propTypes = {
  label: PropTypes.string,
  error: PropTypes.array,
  help_text: PropTypes.string
}
