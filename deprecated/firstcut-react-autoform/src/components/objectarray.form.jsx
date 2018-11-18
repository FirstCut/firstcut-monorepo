
import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider, Segment, Button,
} from 'semantic-ui-react';
import { SchemaParser } from 'firstcut-schema';
import { _ } from 'lodash';

export default function ObjectArrayForm(props) {
  const addSubobjectToSubarray = (e) => {
    const field = props.fieldname;
    const newRecord = props.record.addSubobjectToSubarray(field, {});
    updateField(e, newRecord[field]);
  };

  const removeSubobjectFromSubarray = index => (e) => {
    const field = props.fieldname;
    const newRecord = props.record.removeSubobjectFromSubarray(field, index);
    updateField(e, newRecord[field]);
  };

  const removeButton = index => () => (<Button type="button" onClick={removeSubobjectFromSubarray(index)} icon="trash" color="red" />);

  const onInputChange = (index, onChange) => (e, { name, value }) => {
    const newValue = props.value.setIn([index, name], value);
    updateField(e, newValue);
  };

  const updateField = (e, newValue) => {
    props.onChange(e, { name: props.fieldname, value: newValue });
  };

  const subobject = (obj, index, props) => {
    const {
      renderFields, onChange, record, fieldname, ...rest
    } = props;
    rest.onChange = onInputChange(index, onChange);
    const errors = getNestedErrors(fieldname, index, props.errors);
    const fieldProps = { ...rest, errors };
    return (
      <Segment key={fieldname + index}>
        {React.cloneElement(renderFields, {
          record: obj, key: fieldname, fields: obj.schema.objectKeys(), ...fieldProps,
        })}
        {removeButton(index)()}
      </Segment>
    );
  };

  return (
    <div>
      <Divider horizontal>
        {props.label}
        {' '}
      </Divider>
      {
        props.value && props.value.map((o, index) => subobject(o, index, props))
      }
      <Button type="button" onClick={addSubobjectToSubarray} icon="plus" color="green" />
    </div>
  );
}

function getNestedErrors(fieldname, index, errors) {
  const nested = {};
  const keyToNestedValue = SchemaParser.fieldAsIndexedObjectArrayKey(fieldname, index);
  _.mapKeys(errors, (value, key) => {
    let nestedKey = key.split(keyToNestedValue);
    if (nestedKey.length > 0) {
      nestedKey = _.last(nestedKey);
      nested[nestedKey] = _.last(value);
    }
  });
  return nested;
}
