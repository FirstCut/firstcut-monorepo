
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Button } from 'semantic-ui-react';
import { List, Record } from 'immutable';
import { Autoform } from 'firstcut-react-autoform';

export default class CompanyForm extends React.Component {

  render() {
    const { record, errors, onChange } = this.props;
    const fields = [
      ['name', 'website'],
      'location',
    ];

    if (record.name) {
      fields.push('branding');
      fields.push('brandIntroId');
    }
    return (
      <Autoform
        record={ record }
        fields={ fields }
        errors={ errors }
        onChange={ onChange }>
      </Autoform>
    );
  }
}

CompanyForm.propTypes = {
  record: PropTypes.instanceOf(Record),
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired
};
