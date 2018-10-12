
import React from 'react';
import PropTypes from 'prop-types';
import { Record } from 'immutable';

import { Autoform } from 'firstcut-react-autoform';
import Buttons from '../utils/buttons';
import { userExperience } from '/imports/ui/config';

export default class ProjectForm extends React.Component {
  addToStack(record, onSaveChild) {
    this.props.addToStack(record, onSaveChild);
  }

  render() {
    const {
      record, errors, onChange, ...rest
    } = this.props;
    const overrides = {
      companyId: { additionLabel: (<Buttons.AddNew onClick={this._newCompany} />) },
      clientOwnerId: { additionLabel: (<Buttons.AddNew onClick={this._newClient} />) },
      additionalClientTeamMemberIds: {},
    };

    let fields = [
      ['name', 'blueprint', 'isDummy'],
      ['companyId', 'clientOwnerId'],
      'adminOwnerId',
      'assets',
      'SOWFile',
    ];

    if (userExperience().isEditor) {
      fields = [
        'projectArchive',
      ];
    }

    if (record.companyId) {
      overrides.clientOwnerId.serviceFilter = { companyId: record.companyId };
      overrides.additionalClientTeamMemberIds.serviceFilter = { companyId: record.companyId };
    }

    return (
      <Autoform
        record={record}
        fields={fields}
        errors={errors}
        overrides={overrides}
        onChange={onChange}
        {...rest}
      />
    );
  }

  _saveRelationship = (parentField, childField) => (parent, child) => {
    if (!parent || !parentField) { throw new Meteor.Error('invalid.param', `onSave requires parent record with ${parentField} as param`); }
    if (!child || !child[childField]) { throw new Meteor.Error('invalid.param', `onSave requires child record with ${childField} as param`); }
    return parent.set(parentField, child[childField]);
  }

  _newClient = (e, args) => {
    const client = this.props.record.newClient();
    this.props.editChild(
      client,
      'clientOwnerId',
    );
  }

  _newCompany = () => {
    const company = this.props.record.newCompany();
    this.props.editChild(
      company,
      'companyId',
    );
  }
}

ProjectForm.propTypes = {
  record: PropTypes.instanceOf(Record),
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  editChild: PropTypes.func,
};
