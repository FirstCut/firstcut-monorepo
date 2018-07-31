
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Divider, Segment } from 'semantic-ui-react';
import { Record } from 'immutable';
import Buttons from '/imports/ui/components/utils/buttons.jsx';
import { SchemaParser, SimpleSchemaWrapper } from '/imports/api/schema';
import { BaseModel, RecordWithSchemaFactory } from 'firstcut-models';
import { _ } from 'lodash';

export default function ObjectArrayForm(props) {

  addSubobjectToSubarray = (e) => {
    const field = props.fieldname;
    const new_record = props.record.addSubobjectToSubarray(field, {});
    updateField(e, new_record[field]);
  }

  removeSubobjectFromSubarray = (index) => (e) => {
    const field = props.fieldname;
    const new_record = props.record.removeSubobjectFromSubarray(field, index);
    updateField(e, new_record[field]);
  }

  const addNewButton = ()=> {
    return (<Buttons.AddNew type='button' onClick={addSubobjectToSubarray}/>);
  }

  const removeButton = index => ()=> {
    return (<Buttons.Delete type='button' onClick={removeSubobjectFromSubarray(index)}/>);
  }

  const onInputChange = (index, onChange)=> (e, {name, value})=> {
    const new_value = props.value.setIn([index, name],  value);
    updateField(e, new_value);
  }

  const updateField = (e, new_value) => {
    props.onChange(e, {name: props.fieldname, value: new_value});
  }

  const subobject = (obj, index, props)=> {
    const {renderFields, onChange, record, fieldname, ...rest} = props;
    rest.onChange = onInputChange(index, onChange);
    const errors = getNestedErrors(fieldname, index, props.errors);
    const field_props = {...rest, errors};
    return (
      <Segment>
        {React.cloneElement(renderFields, {record: obj, key: fieldname, fields: obj.schema.objectKeys(), ...field_props})}
        {removeButton(index)()}
      </Segment>
    )
  }

  const objects = props.record.get(props.fieldname);
  return (
    <div>
      <Divider horizontal>{props.label} </Divider>
      {
        props.value && props.value.map((o, index) => subobject(o, index, props))
      }
      {addNewButton()}
    </div>
  )
}

function getNestedErrors(fieldname, index, errors) {
  const nested = {};
  const key_to_nested_value = SchemaParser.fieldAsIndexedObjectArrayKey(fieldname, index);
  _.mapKeys(errors, (value, key) => {
    const parsed = SchemaParser.parseNestedFields(key);
    let nested_key = key.split(key_to_nested_value);
    if (nested_key.length > 0) {
      nested_key = _.last(nested_key);
      nested[nested_key] = _.last(value);
    }
  });
  return nested;
}
