import { Map } from 'immutable';
import Models from 'firstcut-models';
import SimpleSchema from 'simpl-schema';
import { EventSchema } from './shared/action.schemas';
import { ACTIONS, FALLBACK_PHONE_NUMBER, COLLABORATOR_TYPES_TO_LABELS } from 'firstcut-pipeline-consts';

const CollaboratorAdded = new Map({
  key: 'collaborator_added',
  action_title: 'Add collaborator',
  completed_title: 'Collaborator added',
  schema: new SimpleSchema({
    gig_id: String,
    gig_type: String,
    record_id: String,
    collaborator_key: String,
  }).extend(EventSchema),
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(event_data) {
    const {
      record_id, gig_id, gig_type, collaborator_key,
    } = event_data;
    const gig = Models.getRecordFromId(gig_type, gig_id);
    const collaborator = Models.Collaborator.fromId(record_id);
    const collaboratorType = COLLABORATOR_TYPES_TO_LABELS[collaborator_key];
    let phone = collaborator.phone;
    const messageText = `You have been added to ${gig.displayName} as a ${collaboratorType} \n Do not respond to this text message. If you need to contact us, contact Alex at 4157103903`;
    let slackText = `Notified ${collaborator.displayName} that they were added as a ${collaboratorType} to ${gig.displayName}`;
    if (!collaborator || !phone) {
      slackText = `WARNING: attempted to send text to ${collaboratorType} to notify them they were added to a ${gig_type}, but could not find collaborator. @lucy figure out why before a shoot happens!`;
      phone = FALLBACK_PHONE_NUMBER;
    }
    return [{
      type: ACTIONS.text_message,
      country: (collaborator) ? collaborator.country : 'United States',
      body: messageText,
      to: phone,
    }, {
      type: ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: slackText,
      },
    }];
  },
});

export default CollaboratorAdded;
