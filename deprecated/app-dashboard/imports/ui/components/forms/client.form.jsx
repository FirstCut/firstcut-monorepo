
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon } from 'semantic-ui-react';
import { List, Record } from 'immutable';
import { Autoform } from 'firstcut-react-autoform';

export default class ClientForm extends React.Component {
  render() {
    const {
      record, errors, onChange, ...rest
    } = { ...this.props };
    const fields = [
      ['firstName', 'lastName'],
      ['email', 'phone'],
      'companyId',
      'profilePicture',
      'location',
    ];

    return (
      <Autoform
        record={record}
        fields={fields}
        errors={errors}
        onChange={onChange}
        {...rest}
      />
    );
  }
}

ClientForm.propTypes = {
  record: PropTypes.instanceOf(Record),
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};
