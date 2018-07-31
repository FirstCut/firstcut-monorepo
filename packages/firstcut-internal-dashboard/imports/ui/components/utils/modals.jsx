
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Icon, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { withRecordManager } from 'firstcut-models';
import { Autoform } from 'firstcut-react-autoform';
import { PubSub } from 'pubsub-js';

export class ConfirmationModal extends React.PureComponent {
  state = {open: false}
  onConfirm = () => {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    } if (!this.props.prevent_close_on_confirm) {
      this.setState({open: false});
    }
  }
  onReject = () => {
    if (this.props.onReject) {
      this.props.onReject();
    }
    this.setState({open: false});
  }
  render() {
    const {header_text, header_icon, content, onConfirm, onReject, trigger, confirm_text='Yes', reject_text='No'} = this.props;
    const trigger_with_click = React.cloneElement(trigger, {onClick: (e)=>{ e.preventDefault(); this.setState({open: true})}});
    return (
      <Modal trigger={trigger_with_click} basic size='small' open={this.state.open}>
        <Header icon={header_icon} content={header_text} />
        <Modal.Content>
          {content}
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='red' inverted onClick={this.onReject}>
            <Icon name='remove' /> {reject_text}
          </Button>
          <Button color='green' inverted onClick={this.onConfirm}>
            <Icon name='checkmark' /> {confirm_text}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

ConfirmationModal.propTypes = {
  confirmation_text: PropTypes.string,
  header_icon: PropTypes.string,
  header_text: PropTypes.string,
  content: PropTypes.oneOf(PropTypes.string, PropTypes.object),
  onConfirm: PropTypes.func,
  onReject: PropTypes.func,
  trigger: PropTypes.node
}

function UpdateFieldModal(props) {
  const {record, fields, onSaveSuccess, prevent_close_on_confirm=true, ...modal_props} = props;
  const save_event = `save.${record.displayName}`;
  const EditForm = withRecordManager(Autoform);
  const content = (
        <EditForm
          fields={fields}
          save_event={save_event}
          seed_record={record}
          onSaveSuccess={onSaveSuccess}
          />
        )

  const onConfirm = (e) => {
    PubSub.publish(save_event);
  }
  return (
    <ConfirmationModal
      {...modal_props}
      content={content}
      onConfirm={onConfirm}
      prevent_close_on_confirm={prevent_close_on_confirm}
      />
  )
}

export default Modals = {
  UpdateField: UpdateFieldModal,
  Confirmation: ConfirmationModal
};
