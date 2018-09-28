
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select as SemanticSelect } from 'semantic-ui-react';
import { _ } from 'lodash';

export default function Select(props) {
  const { options, additionLabel, ...fieldProps } = { ...props };
  if (!options) {
    return <div />;
  }
  const sorted = _.sortBy(options, item => (item[props.sortBy] ? item[props.sortBy].toLowerCase() : null));
  sorted.unshift(
    { key: '', value: null, text: '' },
  );
  if (additionLabel) {
    return (
      <Form.Field
        control={SemanticSelect}
        search
        allowAdditions
        additionLabel={additionLabel}
        options={sorted}
        {...fieldProps}
      />
    );
  }
  return (
    <Form.Field
      control={SemanticSelect}
      search
      options={sorted}
      {...fieldProps}
    />
  );
}
