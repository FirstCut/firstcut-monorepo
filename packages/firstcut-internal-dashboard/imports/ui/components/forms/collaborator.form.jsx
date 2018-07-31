
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { List, Record } from 'immutable';
import { Autoform } from 'firstcut-react-autoform';

export default class CollaboratorForm extends React.Component {
  render() {
    const { record, errors, onChange } = this.props;
    const fields = [
      ['firstName', 'lastName', 'isActive', 'taxCompliant'],
      ['email', 'phone'],
      ['slackHandle', 'profilePicture'],
      'location',
      'paymentMethod',
      'skills'
    ];

    return (
      <Autoform
        record={ record }
        fields={ fields }
        errors={ errors }
        onChange={ onChange }
      />
    )
  }
}

CollaboratorForm.propTypes = {
  record: PropTypes.instanceOf(Record),
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired
};
