
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select as SemanticSelect } from 'semantic-ui-react';

export default function Select(props) {
  let { options, additionLabel, ...field_props } = { ...props};
  if (!options) {
    return <div></div>;
  }
  let with_null_options = options.unshift(
    {key:'', value: null, text: ''},
  );
  let sorted = _.sortBy(with_null_options.toArray(), (item) => item[props.sortBy] ? item[props.sortBy].toLowerCase(): null );
  if(additionLabel) {
    return (
      <Form.Field
      control={SemanticSelect}
      search
      allowAdditions
      additionLabel={additionLabel}
      options={sorted}
      {...field_props}/>
    )
  } else {
    return (
      <Form.Field
      control={SemanticSelect}
      search
      options={sorted}
      {...field_props}/>
    )
  }
}
