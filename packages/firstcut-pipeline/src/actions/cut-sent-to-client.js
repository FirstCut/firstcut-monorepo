import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions} from '../shared/pipeline.utils.js';
import {getRecordUrl} from 'firstcut-retrieve-url';
import {getCutViewLink} from 'firstcut-retrieve-url';

const CutSentToClient = new Map({
  key: 'has_been_sent_to_client',
  action_title: 'Mark cut as sent to client',
  completed_title: 'Cut sent to client',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const cut = Models.getRecordFromId('Cut', record_id);
    const link = getRecordUrl(cut);
    const view_link = getCutViewLink(cut);
    let email_actions = getEmailActions({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 't-send-cut-to-client',
      getSubstitutionData: (recipient) => {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          deliverable_name: cut.deliverableDisplayName,
          view_link,
          link
        }
      }
    });

    return [
      ...email_actions,
      {
      type: ACTIONS.slack_notify,
      content: {
        text: `${cut.displayName} has been sent to the client! ${link}`
      }
    }]
  }
});

export default CutSentToClient;
