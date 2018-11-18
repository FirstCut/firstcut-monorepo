
import React from 'react';
import PropTypes from 'prop-types';
import { Record, List } from 'immutable';
import {
  Form, Checkbox as SemanticCheckbox,
} from 'semantic-ui-react';
import { removeNonDomFields } from '../autoform.utils';

export default function Checkbox(props) {
  const { onChange, name } = props;
  const { value, ...fieldProps } = removeNonDomFields(props);

  const onCheckboxChange = prevValue => (e) => {
    const newValue = !prevValue;
    onChange(e, { name, value: newValue });
  };

  if (value) {
    fieldProps.checked = true;
  }
  fieldProps.onChange = onCheckboxChange(value);
  return <Form.Field control={SemanticCheckbox} {...fieldProps} name={name} />;
}
