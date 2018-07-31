import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {ScreenshotEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getRecordUrl} from 'firstcut-retrieve-url';

const ScreenshotUploaded = new Map({
  key: 'screenshot_uploaded',
  action_title: 'Upload screenshot',
  completed_title: 'Screenshot uploaded',
  schema: ScreenshotEvents,
  fulfillsPrerequisites: function({record, initiator}) {},
  generateActions: function(event_data) {
    const {record_id, screenshot} = event_data;
    const shoot = Models.getRecordFromId('Shoot', record_id);
    const collaborator = shoot.screenshotCollaborator(screenshot);
    const link = getRecordUrl(shoot);
    const screenshot_url = Models.Shoot.screenshotURL(screenshot.filename);
    return [
      {
        type: ACTIONS.slack_notify,
        channel: 'shoot-notifications',
        content: {
          text: `${shoot.displayName} screenshot uploaded! --- ${link}`,
          attachments: [
            {
              fallback: "SCREENSHOT UPLOAD",
              color: "#8ED137",
              author_name: collaborator.displayName,
              author_link: `http://firstcut.meteorapp.com/collaborators/${collaborator._id}`,
              title: `${collaborator.displayName} uploaded a screenshot for shoot at ${shoot.locationDisplayName}`,
              title_link: `http://firstcut.meteorapp.com/shoots/${shoot._id}`,
              image_url: screenshot_url
            }
          ]
        }
      }
    ]
  }
});

export default ScreenshotUploaded;
