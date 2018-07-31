
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Button } from 'semantic-ui-react';
import { List, Record } from 'immutable';

import { Autoform } from 'firstcut-react-autoform';
import Buttons from '../utils/buttons.jsx';

export default class ProjectForm extends React.Component {
  addToStack(record, onSaveChild) {
    this.props.addToStack(record, onSaveChild);
  }

  render() {
    const {record, errors, onChange} = this.props;
    const overrides = {
      'companyId': {additionLabel: (<Buttons.AddNew onClick={this._newCompany}/>)},
      'clientOwnerId': {additionLabel: (<Buttons.AddNew onClick={this._newClient}/>)},
    }

    const fields = [
      ['name', 'isDummy'],
      ['stage', 'blueprint'],
      ['companyId','clientOwnerId'],
      'adminOwnerId',
      'assets',
    ];

    if (record.companyId) {
      overrides.clientOwnerId.serviceFilter = {companyId: record.companyId};
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

  _saveRelationship = (parent_field, child_field)=> (parent, child)=> {
    if(!parent || !parent_field) { throw new Meteor.Error('invalid.param', `onSave requires parent record with ${parent_field} as param`); }
    if(!child || !child[child_field]) { throw new Meteor.Error('invalid.param', `onSave requires child record with ${child_field} as param`); }
    return parent.set(parent_field, child[child_field]);
  }

  _newClient = (e, args)=> {
    const client = this.props.record.newClient();
    this.props.editChild(
      client,
      'clientOwnerId'
    );
  }

  _newCompany = ()=> {
    const company = this.props.record.newCompany();
    this.props.editChild(
      company,
      'companyId'
    );
  }
}

ProjectForm.propTypes = {
  record: PropTypes.instanceOf(Record),
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  editChild: PropTypes.func
};
