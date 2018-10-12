import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import { Record, List } from 'immutable';
import oid from 'mdbid';
import { withRecordManager } from '/imports/ui/components/managers';
import { USER_IS_UPLOADING } from '/imports/ui/config';
import { PubSub } from 'pubsub-js';
import Models from '/imports/api/models';
import { inSimulationMode } from 'firstcut-user-session';

export default class EditRecordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: new List(),
      saveDisabled: inSimulationMode(),
    };
  }

  componentDidMount() {
    this.addEditItem(null)(this.props.record);
    PubSub.subscribe(USER_IS_UPLOADING, (e, isUploading) => {
      this.setState({ saveDisabled: isUploading });
    });
  }

  addEditItem = parent_record => (record, parent_reference) => {
    this.setState((prevState, props) => {
      const item = this.buildRecordItem(record, parent_record, parent_reference);
      const items = this.state.items.push(item);
      return { items };
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(USER_IS_UPLOADING);
  }

  render() {
    const parent = this.getParentItem();
    const child = this.getChildItem();
    return (
      <div>
        {parent && this.modal(parent)}
        {child && this.modal(child)}
      </div>
    );
  }

  modal(item) {
    const actions = this.getActions();
    return (
      <Modal
        header={item.title}
        content={(
          <Modal.Content>
            {item.element}
          </Modal.Content>
)}
        actions={actions}
        open={this.props.open}
      />
    );
  }

  buildRecordItem = (record, parent_record, parent_reference) => {
    record = ensureRecordHasId(record);
    const element = this.getFormElement(record, parent_record, parent_reference);
    const saveEvent = getSaveEvent(record);
    const title = getTitle(record);
    return new EditRecordItem({
      title, saveEvent, element, _id: record._id,
    });
  }

  getFormElement = (record, parent_record, parent_reference) => {
    const WithManager = withRecordManager(this.props.getEditForm(record));
    const saveEvent = getSaveEvent(record);
    const changeEvent = getChangeEvent(record);
    return (
      <WithManager
        saveEvent={saveEvent}
        changeEvent={changeEvent}
        editChild={this.addEditItem(record)}
        seedRecord={record}
        onSaveSuccess={this.onSaveSuccess(parent_record, parent_reference)}
      />
    );
  }

  getParentItem = () => this.state.items.get(0)

  getChildItem = () => this.state.items.get(1)

  onSaveSuccess = (parent_record, parent_reference) => (saved_record) => {
    if (parent_record && parent_reference) {
      const changeEvent = getChangeEvent(parent_record);
      PubSub.publish(changeEvent, { name: parent_reference, value: saved_record._id });
    }
    if (this.state.items.size == 1) {
      this.props.onClose();
    } else {
      this.closeChildModal();
    }
  }

  getActions = () => {
    const cancel = {
      key: 'cancel',
      content: 'Cancel',
      onClick: this.cancel,
    };
    const go_back = {
      key: 'back',
      content: 'Back',
      onClick: this.closeChildModal,
    };
    const submit_form = {
      key: 'submit_form',
      content: 'Save',
      positive: true,
      onClick: this.submitForm,
      disabled: this.state.saveDisabled,
    };
    const actions = [];
    if (this.editingChild()) {
      actions.push(go_back);
    } else {
      actions.push(cancel);
    }
    actions.push(submit_form);
    return actions;
  }

  editingChild = () => this.state.items.size > 1

  closeChildModal = () => {
    this.setState((prevState, props) => {
      const items = this.state.items.pop();
      return { items };
    });
  }

  cancel = () => {
    this.props.onClose();
  }

  submitForm = (e) => {
    const { _id, saveEvent } = this.state.items.last();
    PubSub.publish(saveEvent);
  }
}

EditRecordModal.propTypes = {
  record: PropTypes.instanceOf(Record).isRequired,
  getEditForm: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

EditRecordItem = Record({
  element: undefined,
  _id: undefined,
  title: undefined,
  saveEvent: undefined,
});

function ensureRecordHasId(record) {
  if (record instanceof Record && !record._id) {
    return record.set('_id', oid());
  } if (!record._id) {
    record._id = oid();
  }
  return record;
}

function getTitle(record) {
  let form_state = 'New';
  if (record.hasBeenSaved) {
    form_state = 'Edit';
  }
  return `${form_state} ${record.modelName}`;
}

function getSaveEvent(record) {
  return `save.${record._id}`;
}

function getChangeEvent(record) {
  return `change.${record._id}`;
}
