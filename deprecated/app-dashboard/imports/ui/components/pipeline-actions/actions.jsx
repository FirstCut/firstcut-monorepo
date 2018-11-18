
import React from 'react';
import { EVENT_ACTION_TITLES } from 'firstcut-pipeline-consts';
import { emitPipelineEvent, getEventActionsAsDescriptiveString, getCustomFieldsSchema } from 'firstcut-pipeline-utils';
import Modals from '/imports/ui/components/utils/modals';
import { userPlayerId } from 'firstcut-user-session';
import { Button } from 'semantic-ui-react';
import { Record } from 'immutable';
import { RecordWithSchemaFactory } from 'firstcut-model-base';
import { getUserActions, userExperience } from '/imports/ui/config';

export function PipelineActionComponent(props) {
  const {
    as, record, action, eventArgs, triggerProps, ...rest
  } = props;
  const TriggerComponent = (as) || Button;
  const title = EVENT_ACTION_TITLES[action];
  const trigger = (
    <TriggerComponent {...triggerProps}>
      {title}
    </TriggerComponent>
  );
  return (
    <ConfirmEmitAction
      record={record}
      trigger={trigger}
      action={action}
      {...eventArgs}
    />
  );
}

// /THIS SHOULD JUST BE A CONFIRM EMIT ACTION THAT TAKES IN STRINGS AND RECORD
class ConfirmEmitAction extends React.Component {
  constructor(props) {
    super(props);
    const { action, record } = props;
    const schema = getCustomFieldsSchema(action, record);
    const CustomFields = RecordWithSchemaFactory(Record, schema);
    const customFields = new CustomFields({});
    this.state = {
      confirmed: false,
      allModalsClosed: false,
      customFields,
    };
  }

  onConfirm = (customFields) => {
    this.toggleModal();
    const { record, action } = this.props;
    const cleaned = customFields.schema.clean(customFields.toJS());
    emitPipelineEvent({
      event: action,
      ...cleaned,
      record,
    });
  }

  toggleModal = () => {
    const confirmed = !this.state.confirmed;
    this.setState({ confirmed });
  }

  render() {
    const { record, trigger, action } = this.props;
    const { confirmed, customFields } = this.state;
    const fields = customFields.schema.allFields() || [];
    const eventData = {
      event: action,
      record_id: record._id,
      initiator_player_id: userPlayerId(),
    };
    const header = (record._id && !userExperience().isClient && !userExperience().isPublic) ? getEventActionsAsDescriptiveString(eventData) : EVENT_ACTION_TITLES[action];
    if (confirmed) {
      return trigger;
    }
    return (
      <Modals.UpdateField
        record={customFields}
        fields={fields}
        trigger={trigger}
        onSaveSuccess={this.onConfirm}
        headerText={header}
        rejectText="Cancel"
        confirmText="Confirm"
      />
    );
  }
}

export function ActionButtons(props) {
  const { as, record } = props;
  const actions = getUserActions(record);
  console.log(actions);
  const components = [];
  return [...components, ...actions.map(a => (
    <PipelineActionComponent
      key={`action-trigger-${a}`}
      record={record}
      action={a}
      as={as}
    />
  ))];
}
