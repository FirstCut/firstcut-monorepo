
import React from 'react';
import PropTypes from 'prop-types';
import Models from '/imports/api/models';

import Analytics from 'firstcut-analytics';
import EditRecordModal from '../components/edit-record.modal';

import ProjectForm from '../components/forms/project.form';
import ClientForm from '../components/forms/client.form';
import CompanyForm from '../components/forms/company.form';
import TaskForm from '../components/forms/task.form';
import CollaboratorForm from '../components/forms/collaborator.form';
import ShootForm from '../components/forms/shoot.form';
import DeliverableForm from '../components/forms/deliverable.form';
import CutForm from '../components/forms/cut.form';
import InvoiceForm from '../components/forms/invoice.form';

const {
  Project, Client, Collaborator, Deliverable, Cut, Shoot, Company, Invoice, Task,
} = Models;

export default function withEditRecordModal(WrappedComponent) {
  return class extends React.Component {
    state = { recordToEdit: null }

    _editRecord = record => (e, elem) => {
      Analytics.trackEditRecordEvent({
        _id: record._id,
        modelName: record.modelName,
      });
      this.setState({ recordToEdit: record });
    }

    _editRecordModal = () => {
      const { recordToEdit } = this.state;
      return (recordToEdit
        && (
        <EditRecordModal
          open={recordToEdit != null}
          record={recordToEdit}
          getEditForm={getEditForm}
          onClose={() => { this.setState({ recordToEdit: null }); }}
        />
        )
      );
    }

    render() {
      return (
        <div>
          { this._editRecordModal() }
          <WrappedComponent editRecord={this._editRecord} {...this.props} />
        </div>
      );
    }
  };
}

function getEditForm(record) {
  const modelName = record.modelName;
  switch (modelName) {
    case Project.modelName:
      return ProjectForm;
    case Task.modelName:
      return TaskForm;
    case Client.modelName:
      return ClientForm;
    case Collaborator.modelName:
      return CollaboratorForm;
    case Deliverable.modelName:
      return DeliverableForm;
    case Cut.modelName:
      return CutForm;
    case Company.modelName:
      return CompanyForm;
    case Shoot.modelName:
      return ShootForm;
    case Invoice.modelName:
      return InvoiceForm;
    default:
      throw new Meteor.Error('unsupported-formtype', `Recieved request for unsupported form type ${modelName}`);
  }
}
