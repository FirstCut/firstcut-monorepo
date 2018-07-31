import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS, FALLBACK_PHONE_NUMBER} from '../shared/pipeline.enum.js';

const CheckinCheckoutReminder = new Map({
  key: 'checkin-checkout-reminder',
  action_title: 'Send checkin-checkout reminder',
  completed_title: 'Reminder to checkin and checkout of shoot sent',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    const collaborator = shoot.videographer;
    let phone = (collaborator)? collaborator.phone : FALLBACK_PHONE_NUMBER;
    return [{
      type: ACTIONS.text_message,
      country: (collaborator) ? collaborator.country : 'United States',
      body: `Your shoot is almost here! This is a reminder to please checkin and checkout of your shoot on the FirstCut Shoot Assistant app. \n \n Do not respond to this text message. If you need to contact us, contact Alex at 4157103903`,
      to: phone
    }]
  }
});

export default CheckinCheckoutReminder;
