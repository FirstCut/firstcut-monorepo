
import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import Models from 'firstcut-models';
import { getRecordUrl } from 'firstcut-retrieve-url';

const ReminderToSetCutDue = new Map({
  key: 'reminder_to_set_cut_due',
  action_title: 'Remind To Set Cut Due',
  completed_title: 'Reminder to set cut due sent',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(event_data) {
    const { record_id } = event_data;
    const deliverable = Models.Deliverable.fromId(record_id);
    const link = getRecordUrl(deliverable);
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `REMINDER: ${deliverable.adminOwnerSlackHandle} Set the cut due date for ${deliverable.displayName} (${link}) if it should not be the default 72hrs from feedback sent!`,
      },
    }];
  },
});

export default ReminderToSetCutDue;
