
import React from 'react';
import PropTypes from 'prop-types';
import { Record, List } from 'immutable';
import { Form, Icon, Input } from 'semantic-ui-react';
import { Random } from 'meteor/random';
import getAutoformSchema from '../autoform.schema.js';
import { htmlifyString } from 'firstcut-utils';
import {removeNonDomFields} from '../autoform.utils.js';

import ObjectArrayForm from './objectarray.form.jsx';
import Label from './label.jsx';
import LocationField from './location.jsx';
import Datetime from './datetime.jsx';
import Checkbox from './checkbox.jsx';
import Dropzone from './dropzone.jsx';
import Select from './select.jsx';
import NumberInput from './number.jsx';

export default class Autoform extends React.Component {
  render() {
    let disable_defaults = (this.props.disable_defaults === undefined)? false: this.props.disable_defaults;
    return (
      <Form>
        <AutoformFields disable_defaults={disable_defaults} {...this.props}/>
      </Form>
    )
  }
}

function AutoformFields(props) {
  const {fields, ...rest} = props;
  return fields.map((field, i)=>{
    const is_row = field instanceof Array;
    const react_key = `form-group-${i}`;
    if (is_row) {
      return <FieldRow key={react_key} fields={field} {...rest}/>;
    }

    return <Field key={react_key} field={field} {...rest}/>;
  });
}

function FieldRow(props) {
  return (
    <Form.Group widths='equal'>
      <AutoformFields {...props}/>
    </Form.Group>
  )
}

function getLabel(props) {
  const {type, help_text, label, error} = props;
  if (type == 'boolean') {
    return label;
  } else {
    return (<Label type={type} label={label} help_text={help_text} error={error}/>);
  }
}

class Field extends React.PureComponent {
  componentDidMount() {
    const {onChange, record, field, errors, overrides, disable_defaults} = this.props;
    const options = {
      errors: errors,
      overrides: overrides
    }
    const field_schema = getAutoformSchema(record.schema, field, options);
    if (!disable_defaults && !record.get(field) && field_schema.defaultValue) {
      //save the default value to the record
      onChange(null, {name: field, value: field_schema.defaultValue});
    }
  }

  render() {
    const {record, field, onChange, errors, overrides, disable_defaults} = this.props;
    const options = {
      errors: errors,
      overrides: overrides
    }
    const field_schema = getAutoformSchema(record.schema, field, options);
    const {type, defaultValue, ...field_props} = field_schema;
    if (field_props.hidden) {
      return <div></div>;
    }
    field_props.label = getLabel({...field_props, type});
    field_props.value = record.get(field);
    if (field_props.value === '') {
      //do not allow empty string fields, prefer null
      onChange(null, {name: field, value: null});
    }
    field_props.record = record;
    field_props.fieldname = field;
    field_props.name = field;
    field_props.onChange = onChange;
    field_props.key = `${field}`;
    switch (type) {
      case 'options':
        return <Select {...field_props}/>
      case 'string':
        let dom_props = removeNonDomFields(field_props);
        return <Form.Field control={Input} {...dom_props}/>
      case 'boolean':
        return <Checkbox {...field_props} />;
      case 'number':
        return <NumberInput {...field_props} />;
      case 'date':
        return <Datetime {...field_props} timezone={record.timezone}/>;
      case 'textarea':
        return <Form.TextArea {...field_props} />;
      case 'location':
        return <LocationField {...field_props} />;
      case 'file':
        return <Dropzone {...field_props} />;
      case 'fileArray':
        return <Dropzone {...field_props} />;
      case 'objectArray':
        return <ObjectArrayForm errors={errors} {...field_props} renderFields={<AutoformFields/>} />
      default:
        console.log(field_props.name);
        console.log(`you need to implement type ${type}`);
        // throw new Meteor.Error('Error field type not in allowed types [String]');
    }
  }
}

AutoformFields.propTypes = {
  record: PropTypes.instanceOf(Record).isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  overrides: PropTypes.object,
  fields: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ])
  )
};
