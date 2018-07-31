
import React from 'react';
import PropTypes from 'prop-types';
import { Record } from 'immutable';
import { Container } from 'semantic-ui-react';
import { Models } from 'firstcut-models';

import EditRecordModal from '../components/edit-record.modal.jsx';
import Loading from '../components/utils/loading.jsx';

import ProjectForm from '../components/forms/project.form.jsx';
import ClientForm from '../components/forms/client.form.jsx';
import CompanyForm from '../components/forms/company.form.jsx';
import CollaboratorForm from '../components/forms/collaborator.form.jsx';
import ShootForm from '../components/forms/shoot.form.jsx';
import DeliverableForm from '../components/forms/deliverable.form.jsx';
import CutForm from '../components/forms/cut.form.jsx';
import InvoiceForm from '../components/forms/invoice.form.jsx';

const { Project, Client, Collaborator, Deliverable, Cut, Shoot, Company, Invoice } = Models;

export default function withEditRecordModal(WrappedComponent) {
  return class extends React.Component {
    state = {edit_record: null}

    _editRecord = record => (e, elem) => {
      this.setState({edit_record: record})
    }

    _editRecordModal = ()=> {
      const {edit_record} = this.state;
      return ( edit_record &&
        <EditRecordModal
            open={edit_record != null}
            record={edit_record}
            getEditForm={getEditForm}
            onClose={()=> { this.setState({edit_record: null});}}
            />
          )
    }

    render() {
      return (
        <div>
        { this._editRecordModal() }
        <WrappedComponent editRecord={this._editRecord} {...this.props}/>
        </div>
      )
    }
  }
}

function getEditForm(record) {
  const model_name = record.model_name;
  switch (model_name) {
    case Project.model_name:
      return ProjectForm;
    case Client.model_name:
      return ClientForm;
    case Collaborator.model_name:
      return CollaboratorForm;
    case Deliverable.model_name:
      return DeliverableForm;
    case Cut.model_name:
      return CutForm;
    case Company.model_name:
      return CompanyForm;
    case Shoot.model_name:
      return ShootForm;
    case Invoice.model_name:
      return InvoiceForm;
    default:
      throw new Meteor.Error('unsupported-formtype', `Recieved request for unsupported form type ${model_name}`);
  }
}
