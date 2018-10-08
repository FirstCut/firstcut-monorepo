
import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';

const CutDueReminder = new Map({
  key: 'cut_due_reminder',
  action_title: 'Send Cut Due Reminder',
  completed_title: 'Cut due reminder sent',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(Models, event_data) {
    const { record_id, cut_type_due } = event_data;
    const deliverable = Models.Deliverable.fromId(record_id);
    if (deliverable.hasCutOfType(cut_type_due)) {
      return [];
    }
    const link = getRecordUrl(deliverable);
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `The next cut for ${deliverable.displayName} (${link}) is due in 24hrs ${deliverable.postpoOwnerSlackHandle} ${deliverable.adminOwnerSlackHandle}.`,
      },
    }];
  },
});

export default CutDueReminder;
