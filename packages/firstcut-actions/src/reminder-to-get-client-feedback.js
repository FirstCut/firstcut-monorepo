
import { Map } from 'immutable';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import Models from 'firstcut-models';
import { getRecordUrl } from 'firstcut-retrieve-url';

const ReminderToGetClientFeedback = new Map({
  key: 'reminder_to_get_client_feedback',
  action_title: 'Remind to get client feedback',
  completed_title: 'Reminder to get client feedback sent',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(eventData) {
    const { record_id } = eventData;
    const cut = Models.Cut.fromId(record_id);
    if (cut.clientHasSubmittedFeedback) {
      return [];
    }
    const link = getRecordUrl(cut);
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `You sent ${cut.displayName} (${link}) to the client for review 72hrs ago and they have not yet provided feedback. Is it time to remind them? ${cut.adminOwnerSlackHandle}`,
      },
    }];
  },
});

export default ReminderToGetClientFeedback;
