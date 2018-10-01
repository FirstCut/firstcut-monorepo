import { Map } from 'immutable';
import Models from 'firstcut-models';
import { ScreenshotEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';

const ScreenshotUploaded = new Map({
  key: 'screenshot_uploaded',
  action_title: 'Upload screenshot',
  completed_title: 'Screenshot uploaded',
  schema: ScreenshotEvents,
  fulfillsPrerequisites({ record, initiator }) { return true; },
  generateActions(eventData) {
    const { record_id, screenshot } = eventData;
    const shoot = Models.Shoot.fromId(record_id);
    const collaborator = shoot.screenshotCollaborator(screenshot);
    const link = getRecordUrl(shoot);
    const screenshotURL = shoot.screenshotURL(screenshot.filename);
    const collabLink = getRecordUrl(collaborator);
    return [
      {
        type: ACTIONS.slack_notify,
        channel: 'shoot-notifications',
        content: {
          text: `${shoot.displayName} screenshot uploaded! --- ${link} ${shoot.adminOwnerSlackHandle}`,
          attachments: [
            {
              fallback: 'SCREENSHOT UPLOAD',
              color: '#8ED137',
              author_name: collaborator.displayName,
              author_link: collabLink,
              title: `${collaborator.displayName} uploaded a screenshot for shoot at ${shoot.locationDisplayName} ${shoot.adminOwnerSlackHandle}`,
              title_link: link,
              image_url: screenshotURL,
            },
          ],
        },
      },
    ];
  },
});

export default ScreenshotUploaded;
