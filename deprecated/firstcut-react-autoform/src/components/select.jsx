
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select as SemanticSelect } from 'semantic-ui-react';
import { _ } from 'lodash';
import { removeNonDomFields } from '../autoform.utils';

export default function Select(props) {
  const {
    options, additionLabel, sortBy, ...rest
  } = props;
  if (!options) {
    return <div />;
  }
  const fieldProps = removeNonDomFields(rest);
  const sorted = _.sortBy(options, item => (item[sortBy] ? item[sortBy].toLowerCase() : null));
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
