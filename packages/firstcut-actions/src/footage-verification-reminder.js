import { Map } from 'immutable';
import Models from 'firstcut-models';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';

const FootageVerificationReminder = new Map({
  key: 'footage_verification_reminder',
  action_title: 'Remind to verify footage',
  completed_title: 'Reminder to verify footage sent',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(event_data) {
    const { record_id } = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    if (shoot.isDummy || shoot.hasVerifiedFootage) {
      return [];
    }

    const link = getRecordUrl(shoot);
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `It has been 24hrs after shoot checkout -- The footage for ${shoot.displayName} ( ${link} ) should have been uploaded and verified by now ${shoot.adminOwnerSlackHandle}`,
      },
    }];
  },
});

export default FootageVerificationReminder;
