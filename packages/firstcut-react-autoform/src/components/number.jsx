
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';

export default function NumberInput(props) {
  const { onChange, ...rest} = {...props};
  onNumberChange = (onChange)=> (e, {name, value})=> {
    let as_float = parseFloat(value);
    onChange(null, {name: name, value: as_float});
  }

  rest.onChange = onNumberChange(onChange);
  return <Form.Field control={Input} type='number' {...rest} />
}
