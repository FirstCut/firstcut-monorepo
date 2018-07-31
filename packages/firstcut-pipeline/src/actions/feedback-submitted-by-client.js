import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions} from '../shared/pipeline.utils.js';
import {getRecordUrl} from 'firstcut-retrieve-url';

const FeedbackSubmittedByClient = new Map({
  key: 'feedback_submitted_by_client',
  action_title: 'Submit Feedback',
  completed_title: 'Feedback Submitted',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const cut = Models.Cut.fromId(record_id);
    const link = getRecordUrl(cut);
    const changes = (cut.revisions) ? cut.revisions.split(/\n/): [];
    let email_actions = getEmailActions({
      recipients: [cut.adminOwner],
      template: 'feedback-submitted-by-client',
      getSubstitutionData: (recipient) => {
        return {
          name: recipient.firstName,
          cut_name: cut.displayName,
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
          text: `Cut ${cut.displayName} feedback has been submitted by the client through the dashboard -- ${link}`
        }
      }
    ]
  }
});

export default FeedbackSubmittedByClient;
