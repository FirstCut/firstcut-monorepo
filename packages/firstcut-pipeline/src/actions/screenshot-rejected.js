
import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {ScreenshotEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS, FALLBACK_PHONE_NUMBER} from '../shared/pipeline.enum.js';

const ScreenshotRejected = new Map({
  key: 'screenshot_rejected',
  action_title: 'Reject screenshot',
  completed_title: 'Screenshot rejected',
  schema: ScreenshotEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id, screenshot} = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    const collaborator = shoot.screenshotCollaborator(screenshot);
    let slack_text = `A screenshot was rejected for ${shoot.displayName}. Reasons: ${screenshot.notes}`;
    let phone = (collaborator)? collaborator.phone : FALLBACK_PHONE_NUMBER;
    if (!collaborator || !phone) {
      slack_text = `WARNING: attempted to send text to collaborator for screenshot approval, but could not find collaborator. \n please contact them manually for shoot ${shoot.displayName}`;
      phone = FALLBACK_PHONE_NUMBER;
    }
    return [{
      type: ACTIONS.slack_notify,
      channel: 'shoot-notifications',
      content: {
        text: slack_text,
      }
    }, {
      type: ACTIONS.text_message,
      country: (collaborator) ? collaborator.country : 'United States',
      body: `Your screenshot ${shoot.getScreenshotDisplayString(screenshot)} was rejected. Reason: ${screenshot.notes}. Do not respond to this text message. If you need to contact us, contact Alex at 4157103903`,
      to: phone
    }]
  }
});

export default ScreenshotRejected;
