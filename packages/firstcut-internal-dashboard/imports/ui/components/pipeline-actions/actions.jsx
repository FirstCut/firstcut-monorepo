
import React from 'react';
import {userHasPermission} from '/imports/ui/config';
import {emitPipelineEvent} from 'firstcut-utils';
import {EVENT_ACTION_TITLES, COLLABORATOR_TYPES_TO_LABELS, getEventActionsAsDescriptiveString} from 'firstcut-pipeline';
import Modals from '/imports/ui/components/utils/modals.jsx';
import {Button, Header} from 'semantic-ui-react';
import {userPlayerId} from 'firstcut-utils';
import {RecordWithSchemaFactory, BaseModel} from 'firstcut-models';
import { SimpleSchemaWrapper as Schema } from '/imports/api/schema';

export function PipelineActionComponent(props) {
  let {as, record, action, event_args, ...rest} = props;
  const TriggerComponent = (as) ? as : Button;
  const title = EVENT_ACTION_TITLES[action];
  const trigger = (
    <TriggerComponent className='center aligned'>
      <Button color='green' fluid>{title}</Button>
    </TriggerComponent>
  )
  return (
    <ConfirmEventTriggerModal
      record={record}
      trigger={trigger}
      action={action}
      {...event_args}
      />
  )
}

///THIS SHOULD JUST BE A CONFIRM EMIT ACTION THAT TAKES IN STRINGS AND RECORD
class ConfirmEmitAction extends React.Component {
  constructor(props) {
    super(props);
    const ExtraDataSchema = new Schema({
      emailSupplementaryData: String,
      targetPlayer: {
        type: String,
        enumOptions: COLLABORATOR_TYPES_TO_LABELS
      }
    });
    const ExtraData = RecordWithSchemaFactory(Record, ExtraDataSchema);
    const supplementary_data = new ExtraData({});
    this.state = {confirmed: false, all_modals_closed: false, supplementary_data};
  }

  confirmAction = (snippet) => {
    this.toggleModal();
    emitPipelineEvent({
      event_data: {
        event: EVENTS.snippet_requested,
      },
      record: this.props.record
    });
  }

  toggleModal = () => {
    const confirmed = !this.state.confirmed;
    this.setState({confirmed});
  }
  closeModals = () => {
    const all_modals_closed = !this.state.all_modals_closed;
    this.setState({all_modals_closed});
  }
  render() {
    const { record } = this.props;
    const fields = ['emailSupplementaryData', 'targetPlayer'];
    const confirm_action = <Button floated='right' color='green'>Confirm</Button>
    return (
      <Container>
      { this.state.confirmed &&
        <ConfirmSnippetRequest open={true} onConfirm={this.toggleModal}/>
      }
      { !this.state.confirmed &&
        <Modals.UpdateField
          record={this.state.snippet}
          fields={[fields]}
          trigger={confirm_action}
          onSaveSuccess={this.confirmAction}
          header_text={'Please enter the start and end timestamps for the snippet using mm:ss format (for example 01:23)'}
          reject_text='Cancel'
          confirm_text='Confirm'
          />
      }
      { !record.hasBrandIntro &&
        <Modal
          trigger={request_snippet_button}
          header={'Requirements not fulfilled'}
          content={'It seems we do not have your logo available; please contact teamfirstcut@firstcut.io to continue!'}
          size='small'
          basic
          />
        }
      </Container>
    )
  }
}


function ConfirmEventTriggerModal(props) {
  const {trigger, actionOverride, action, record, ...event_args} = props;
  const event_data = {
    event: action,
    record_id: record._id,
    initiator_player_id: userPlayerId(),
    ...event_args
  };
  const event_descriptive_string = getEventActionsAsDescriptiveString({event_data});
  const emitEvent = () => {
    emitPipelineEvent({record, event_data});
  }
  return (
    <Modals.Confirmation
      trigger={trigger}
      header_icon='checkmark'
      header_text='Are you sure?'
      onConfirm={emitEvent}
      content={event_descriptive_string}
      {...props}
      />
    );
}
