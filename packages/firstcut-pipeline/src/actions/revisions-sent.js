import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions, historyIncludesEvent} from '../shared/pipeline.utils.js';
import {getRecordUrl} from 'firstcut-retrieve-url';

const key = 'revisions_sent';
const RevisionsSent = new Map({
  key,
  action_title: 'Send feedback',
  completed_title: 'Feedback sent',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
    return !historyIncludesEvent({record, event: 'cut_approved_by_client'}) && !historyIncludesEvent({record, event: key});
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const cut = Models.getRecordFromId('Cut', record_id);
    const link = getRecordUrl(cut);
    const changes = (cut.revisions) ? cut.revisions.split(/\n/): [];
    let email_actions = getEmailActions({
      recipients: [cut.postpoOwner, cut.adminOwner],
      template: 'revisions-verified',
      getSubstitutionData: (recipient) => {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
          project_manager_name: cut.adminOwnerDisplayName,
          changes: changes,
          deliverable_name: cut.deliverableDisplayName,
          link
        }
      }
    });

    return [
      ...email_actions,
    {
      type: ACTIONS.slack_notify,
      content: {
        text: `Cut ${cut.displayName} feedback has been submitted and verified! ${link}`
      }
    }]
  },
});

export default RevisionsSent;
