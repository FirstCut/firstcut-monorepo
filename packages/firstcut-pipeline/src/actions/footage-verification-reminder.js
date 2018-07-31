import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';

const FootageVerificationReminder = new Map({
  key: 'footage_verification_reminder',
  action_title: 'Remind to verify footage',
  completed_title: 'Footage verified',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    if (shoot.isDummy) {
      return [];
    }
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `It has been 24hrs after shoot checkout -- The footage for ${shoot.displayName} should have been uploaded and verified by now...`
      }
    }]
  }
});

export default FootageVerificationReminder;
