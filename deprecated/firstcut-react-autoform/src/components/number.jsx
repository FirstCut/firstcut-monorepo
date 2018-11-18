
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import { removeNonDomFields } from '../autoform.utils';

export default function NumberInput(props) {
  const { onChange, value = undefined, ...rest } = props;
  const domProps = removeNonDomFields(rest);
  const onNumberChange = (e, { name, value }) => {
    const asFloat = parseFloat(value);
    onChange(null, { name, value: asFloat });
  };

  return <Form.Field control={Input} onChange={onNumberChange} type="number" {...domProps} value={value} />;
}
