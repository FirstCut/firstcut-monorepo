import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {EventSchema} from '../shared/pipeline.schemas.js';
import {ACTIONS, FALLBACK_PHONE_NUMBER, COLLABORATOR_TYPES_TO_LABELS} from '../shared/pipeline.enum.js';
import SimpleSchema from 'simpl-schema';

const CollaboratorAdded = new Map({
  key: 'collaborator_added',
  action_title: 'Add collaborator',
  completed_title: 'Collaborator added',
  schema: new SimpleSchema({
    gig_id: String,
    gig_type: String,
    record_id: String,
    collaborator_key: String
  }).extend(EventSchema),
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id, gig_id, gig_type, collaborator_key} = event_data;
    const gig = Models.getRecordFromId(gig_type, gig_id);
    const collaborator = Models.Collaborator.fromId(record_id);
    const collaborator_type = COLLABORATOR_TYPES_TO_LABELS[collaborator_key];
    let phone = collaborator.phone;
    let message_text = `You have been added to ${gig.displayName} as a ${collaborator_type} \n Do not respond to this text message. If you need to contact us, contact Alex at 4157103903`;
    let slack_text = `Notified ${collaborator.displayName} that they were added as a ${collaborator_type} to ${gig.displayName}`;
    if (!collaborator || !phone) {
      slack_text = `WARNING: attempted to send text to ${collaborator_type} to notify them they were added to a ${gig_type}, but could not find collaborator. @lucy figure out why before a shoot happens!`;
      phone = FALLBACK_PHONE_NUMBER;
    }
    return [{
      type: ACTIONS.text_message,
      country: (collaborator) ? collaborator.country : 'United States',
      body: message_text,
      to: phone
    }, {
      type: ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: slack_text
      }
    }]
  }
});

export default CollaboratorAdded;
