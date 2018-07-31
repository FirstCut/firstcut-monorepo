
import React from 'react';
import PropTypes from 'prop-types';
import { Record, List } from 'immutable';
import { Form, Icon, Input, Checkbox as SemanticCheckbox} from 'semantic-ui-react';

export default function Checkbox(props) {
  const { value, onChange, ...field_props } = {...props};

  const onCheckboxChange = (onChange, name, prev_value) => (e)=> {
    const new_value = !prev_value;
    onChange(e, {name: name, value: new_value});
  }

  if (value) {
    field_props.checked = true;
  }
  field_props.onChange = onCheckboxChange(onChange, props.name, value);
  return <Form.Field control={SemanticCheckbox} {...field_props}/>
}
