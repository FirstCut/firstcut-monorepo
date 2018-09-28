
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon } from 'semantic-ui-react';
import { List, Record } from 'immutable';
import { Autoform } from 'firstcut-react-autoform';
import { userExperience } from '/imports/ui/config';

export default class DeliverableForm extends React.Component {
  render() {
    const { record, errors, onChange } = this.props;
    const overrides = {};
    let fields = [
      'blueprint',
      ['name', 'estimatedDuration'],
      'projectId',
      'clientOwnerId',
      'postpoOwnerId',
      'nextCutDue',
      ['title', 'cta'],
      'songs',
      'adminNotes',
      'assets',
    ];

    if (userExperience().isEditor) {
      fields = [
        'songs',
      ];
    }

    if (record.project && record.project.companyId) {
      overrides.clientOwnerId = { serviceFilter: { companyId: record.project.companyId } };
    }

    return (
      <Autoform
        record={record}
        fields={fields}
        errors={errors}
        overrides={overrides}
        onChange={onChange}
      />
    );
  }
}

DeliverableForm.propTypes = {
  record: PropTypes.instanceOf(Record),
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};
