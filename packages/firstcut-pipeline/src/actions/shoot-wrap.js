
import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions} from '../shared/pipeline.utils.js';
import {getRecordUrl, getInviteLink} from 'firstcut-retrieve-url';

const ShootWrap = new Map({
  key: 'shoot_wrap',
  action_title: 'Shoot wrap',
  completed_title: 'Shoot wrapped',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    let email_actions = getEmailActions({
      recipients: [shoot.adminOwner],
      template: 'ttc-shoot-wrap',
      getSubstitutionData: (recipient) => {
        let shoot_link = getInviteLink(shoot.clientOwner, getRecordUrl(shoot));
        return {
          name: shoot.clientOwner.firstName,
          shoot_display_name: shoot.displayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_link
        }
      }
    });

    return [
      ...email_actions,
    {
      type: ACTIONS.slack_notify,
      content: {
        text: `Shoot Wrap notification for ${shoot.displayName}. The client email has been sent to the project manager (${shoot.adminOwnerDisplayName}). Please forward the email to the client if the email seems correct`
      }
    }]
  }
});

export default ShootWrap;
