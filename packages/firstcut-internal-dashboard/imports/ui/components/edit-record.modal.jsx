import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Image, Header, Icon, Ref, Reveal } from 'semantic-ui-react';
import { Stack, Record, Map, List } from 'immutable';
import { Random } from 'meteor/random';
import { withRecordManager } from 'firstcut-models';
import { hasPermission } from '/imports/ui/config';

export default class EditRecordModal extends React.Component {
  state = {items: new List()}

  componentDidMount() {
    this.addEditItem(null)(this.props.record);
  }

  addEditItem = (parent_record) => (record, parent_reference) => {
    this.setState((prevState, props)=> {
      const item = this.buildRecordItem(record, parent_record, parent_reference);
      let items = this.state.items.push(item);
      return {items};
    });
  }

  render() {
    const parent = this.getParentItem();
    const child = this.getChildItem();
    return (
      <div>
        {parent && this.modal(parent)}
        {child && this.modal(child)}
      </div>
    )
  }

  modal(item) {
    const actions = this.getActions();
    return (
      <Modal
        header={ item.title }
        content={ <Modal.Content>{item.element}</Modal.Content> }
        actions={ actions }
        open = { this.props.open }
      />
    )
  }

  buildRecordItem = (record, parent_record, parent_reference) => {
    record = ensureRecordHasId(record);
    const element = this.getFormElement(record, parent_record, parent_reference);
    const save_event = getSaveEvent(record);
    const title = getTitle(record);
    return new EditRecordItem({title, save_event, element, _id: record._id});
  }

  getFormElement = (record, parent_record, parent_reference) => {
    const WithManager = withRecordManager(this.props.getEditForm(record));
    const save_event = getSaveEvent(record);
    const change_event = getChangeEvent(record);
    return (
      <WithManager
        save_event={save_event}
        change_event={change_event}
        editChild={this.addEditItem(record)}
        seed_record={record}
        onSaveSuccess={this.onSaveSuccess(parent_record, parent_reference)}
        />
    )
  }

  getParentItem = () => {
    return this.state.items.get(0);
  }

  getChildItem = () => {
    return this.state.items.get(1);
  }

  onSaveSuccess = (parent_record, parent_reference) => (saved_record) => {
    if (parent_record && parent_reference) {
      const change_event = getChangeEvent(parent_record);
      PubSub.publish(change_event, {name: parent_reference, value: saved_record._id});
    }
    if (this.state.items.size == 1) {
      this.props.onClose();
    } else {
      this.closeChildModal();
    }
  }

  getActions = ()=> {
    const cancel = {
      key: 'cancel',
      content: 'Cancel',
      onClick: this.cancel
    };
    const go_back = {
      key: 'back',
      content: 'Back',
      onClick: this.closeChildModal
    };
    const submit_form = {
      key: 'submit_form',
      content: 'Save',
      positive: true ,
      onClick: this.submitForm
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

  editingChild = () => {
    return this.state.items.size > 1;
  }

  closeChildModal = () => {
    this.setState((prevState, props)=> {
      let items = this.state.items.pop();
      return {items};
    });
  }

  cancel = () => {
    this.props.onClose();
  }

  submitForm = (e) => {
    const {_id, save_event} = this.state.items.last();
    PubSub.publish(save_event);
  }
}

EditRecordModal.propTypes = {
  record: PropTypes.instanceOf(Record).isRequired,
  getEditForm: PropTypes.func.isRequired,
  onClose: PropTypes.func
};

EditRecordItem = Record({
  element: undefined,
  _id: undefined,
  title: undefined,
  save_event: undefined,
});

function ensureRecordHasId(record) {
  if(record instanceof Record && !record._id) {
    return record.set('_id', Random.id());
  } else if(!record._id){
    record._id = Random.id();
  }
  return record;
}

function getTitle(record) {
  let form_state = 'New';
  if(record.has_been_saved) {
    form_state = 'Edit';
  }
  return `${form_state} ${record.model_name}`;
}

function getSaveEvent(record) {
  return `save.${record._id}`;
}

function getChangeEvent(record) {
  return `change.${record._id}`;
}
