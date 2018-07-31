import React from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

export default function ConfirmationModal(props){
  const {title_icon, content, title, onConfirm, onDeny, open} = props;
  return (
    <Modal basic size='small' open={open}>
      <Header icon={title_icon} content={title} />
      <Modal.Content>
        <p>{content}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='red' inverted onClick={onDeny}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' inverted onClick={onConfirm}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
