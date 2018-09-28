import { Map } from 'immutable';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import Models from 'firstcut-models';
import { getRecordUrl } from 'firstcut-retrieve-url';

const SendFeedbackReminder = new Map({
  key: 'send_feedback_reminder',
  action_title: 'Remind to send feedback',
  completed_title: 'Reminder to send feedback sent',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(event_data) {
    const { record_id } = event_data;
    const cut = Models.Cut.fromId(record_id);
    if (cut.hasVerifiedRevisions) {
      return [];
    }
    const link = getRecordUrl(cut);
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `Feedback for ${cut.displayName} (${link}) was submitted 12hrs ago. This is a reminder to verify it and send it to the editor! ${cut.adminOwnerSlackHandle}`,
      },
    }];
  },
});

export default SendFeedbackReminder;
