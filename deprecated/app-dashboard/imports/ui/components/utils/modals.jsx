
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, Icon, Header,
} from 'semantic-ui-react';
import { withRecordManager } from '/imports/ui/components/managers';
import { Autoform } from 'firstcut-react-autoform';
import { PubSub } from 'pubsub-js';
import { inSimulationMode } from 'firstcut-user-session';

export class ConfirmationModal extends React.PureComponent {
  static defaultProps = {
    confirmText: 'Yes',
    rejectText: 'No',
    headerIcon: '',
    headerText: '',
    content: '',
    preventCloseOnConfirm: false,
    onConfirm: () => {},
    onReject: () => {},
  }

  state = { open: false }

  onConfirm = () => {
    const { onConfirm, preventCloseOnConfirm } = this.props;
    if (onConfirm) {
      onConfirm();
    } if (!preventCloseOnConfirm) {
      this.setState({ open: false });
    }
  }

  onReject = () => {
    const { onReject } = this.props;
    if (onReject) {
      onReject();
    }
    this.setState({ open: false });
  }

  render() {
    const {
      headerText, headerIcon, content, trigger, confirmText, rejectText,
    } = this.props;
    const { open } = this.state;
    const triggerWithClick = React.cloneElement(trigger, { onClick: (e) => { e.preventDefault(); this.setState({ open: true }); } });
    let submitDisabled = false;
    if (inSimulationMode()) {
      submitDisabled = true;
    }
    return (
      <Modal trigger={triggerWithClick} basic size="small" open={open}>
        <Header icon={headerIcon} content={headerText} />
        <Modal.Content>
          {content}
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={this.onReject}>
            <Icon name="remove" />
            {' '}
            {rejectText}
          </Button>
          <Button color="green" inverted onClick={this.onConfirm} disabled={submitDisabled}>
            <Icon name="checkmark" />
            {' '}
            {confirmText}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

ConfirmationModal.propTypes = {
  confirmText: PropTypes.string,
  rejectText: PropTypes.string,
  headerIcon: PropTypes.string,
  headerText: PropTypes.string,
  content: PropTypes.object,
  onConfirm: PropTypes.func,
  onReject: PropTypes.func,
  preventCloseOnConfirm: PropTypes.bool,
  trigger: PropTypes.node.isRequired,
};

function UpdateFieldModal(props) {
  const {
    record, fields, onSaveSuccess, preventCloseOnConfirm = true, ...modalProps
  } = props;
  const saveEvent = `save.${record.displayName}`;
  const EditForm = withRecordManager(Autoform);
  const content = (
    <EditForm
      fields={fields}
      saveEvent={saveEvent}
      seedRecord={record}
      onSaveSuccess={onSaveSuccess}
    />
  );

  const onConfirm = (e) => {
    PubSub.publish(saveEvent);
  };
  return (
    <ConfirmationModal
      {...modalProps}
      content={content}
      onConfirm={onConfirm}
      preventCloseOnConfirm={preventCloseOnConfirm}
    />
  );
}

const Modals = {
  UpdateField: UpdateFieldModal,
  Confirmation: ConfirmationModal,
};

export default Modals;
