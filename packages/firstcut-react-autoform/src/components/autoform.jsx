
import React from 'react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { Record } from 'immutable';
import { Form, Input } from 'semantic-ui-react';
import moment from 'moment';
import getAutoformSchema from '../autoform.schema';
import { removeNonDomFields } from '../autoform.utils';

import ObjectArrayForm from './objectarray.form';
import Label from './label';
import LocationField from './location';
import Datetime from './datetime';
import Checkbox from './checkbox';
import Dropzone from './dropzone';
import Select from './select';
import NumberInput from './number';

export default class Autoform extends React.Component {
  render() {
    const disableDefaults = (this.props.disableDefaults === undefined) ? false : this.props.disableDefaults;
    return (
      <Form>
        <AutoformFields disableDefaults={disableDefaults} {...this.props} />
      </Form>
    );
  }
}

function AutoformFields(props) {
  const { fields, ...rest } = props;
  return fields.map((field, i) => {
    const isRow = field instanceof Array;
    const reactKey = `form-group-${i}`;
    if (isRow) {
      return <FieldRow key={reactKey} fields={field} {...rest} />;
    }

    return <Field key={reactKey} field={field} {...rest} />;
  });
}

function FieldRow(props) {
  return (
    <Form.Group widths="equal">
      <AutoformFields {...props} />
    </Form.Group>
  );
}

function getLabel(props) {
  const {
    type, helpText, label, error,
  } = props;
  if (type === 'boolean') {
    return label;
  }
  return (<Label type={type} label={label} helpText={helpText} error={error} />);
}

class Field extends React.PureComponent {
  componentDidMount() {
    const {
      onChange, record, field, errors, overrides, disableDefaults,
    } = this.props;
    let models = this.props.models;
    const options = {
      errors,
      overrides,
    };
    if (!models) {
      models = record.models;
    }
    const fieldSchema = getAutoformSchema(models, record, field, options);
    if (!disableDefaults && !record.get(field) && fieldSchema.defaultValue) {
      // save the default value to the record
      onChange(null, { name: field, value: fieldSchema.defaultValue });
    }
  }

  render() {
    const {
      record, field, onChange, errors, overrides, disableDefaults, withFileManager,
    } = this.props;
    const options = {
      errors,
      overrides,
    };
    let models = this.props.models;
    if (!models) {
      models = record.models;
    }
    const fieldSchema = getAutoformSchema(models, record, field, options);
    const { type, defaultValue, ...fieldProps } = fieldSchema;
    if (fieldProps.hidden) {
      return <div />;
    }
    fieldProps.label = getLabel({ ...fieldProps, type });
    fieldProps.value = record.get(field);
    if (fieldProps.value === '') {
      // do not allow empty string fields, prefer null
      onChange(null, { name: field, value: null });
    }
    if (fieldProps.options && fieldProps.value) {
      const valueIsArray = Array.isArray(fieldProps.value);
      const values = (valueIsArray) ? fieldProps.value : [fieldProps.value];
      const optionValues = fieldProps.options.map(o => o.key);
      const filteredValues = values.filter(val => optionValues.includes(val));
      if (!_.isEqual(filteredValues, values)) {
        if (valueIsArray) {
          onChange(null, { name: field, value: filteredValues });
        } else {
          onChange(null, { name: field, value: null });
        }
      }
    }
    fieldProps.record = record;
    fieldProps.fieldname = field;
    fieldProps.name = field;
    fieldProps.onChange = onChange;
    fieldProps.key = `${field}`;
    switch (type) {
      case 'options':
        return <Select {...fieldProps} />;
      case 'multiselect':
        return <Select {...fieldProps} multiple />;
      case 'string':
        const domProps = removeNonDomFields(fieldProps);
        return <Form.Field control={Input} {...domProps} />;
      case 'boolean':
        return <Checkbox {...fieldProps} />;
      case 'number':
        return <NumberInput {...fieldProps} />;
      case 'date':
        // const timezone = record.timezone || getTimezoneFromDate(fieldProps.value);
        return <Datetime {...fieldProps} timezone={fieldProps.timezone || record.timezone} />;
      case 'textarea':
        return <Form.TextArea {...fieldProps} />;
      case 'location':
        return <LocationField {...fieldProps} />;
      case 'file':
        return <Dropzone {...fieldProps} withFileManager={withFileManager} />;
      case 'fileArray':
        return <Dropzone {...fieldProps} withFileManager={withFileManager} />;
      case 'objectArray':
        return <ObjectArrayForm errors={errors} {...fieldProps} renderFields={<AutoformFields />} />;
      default:
        console.log(`you need to implement type ${type}`);
        return <div />;
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
      PropTypes.string,
    ]),
  ),
};
