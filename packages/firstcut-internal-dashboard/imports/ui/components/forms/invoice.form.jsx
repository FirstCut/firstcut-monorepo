
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon } from 'semantic-ui-react';
import { List } from 'immutable';
import { Autoform } from 'firstcut-react-autoform';

export default class InvoiceForm extends React.Component {
  render() {
    const { record, errors, onChange } = {...this.props};
    console.log(record.type);
    let overrides = {};
    const fields = [
      ['type', 'payeeId'],
      'amount',
      'transactionId'
    ];
    if (Meteor.settings.public.environment == 'development') {
      fields.push('status');
    }
    if (record.type) {
      overrides = {
        'gigId': {serviceDependency: record.type}
      }
      fields.push('gigId');
      fields.push('note');
    }

    return (
      <Autoform
        record={ record }
        fields={ fields }
        errors={ errors }
        overrides={ overrides }
        onChange={ onChange }
      />
    );
  }
}
