
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';

export default function NumberInput(props) {
  const { onChange, ...rest } = { ...props };
  const onNumberChange = onChange => (e, { name, value }) => {
    const asFloat = parseFloat(value);
    onChange(null, { name, value: asFloat });
  };

  rest.onChange = onNumberChange(onChange);
  return <Form.Field control={Input} type="number" {...rest} />;
}
