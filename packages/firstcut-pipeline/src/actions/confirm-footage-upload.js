import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions, historyIncludesEvent} from '../shared/pipeline.utils.js';
import {getRecordUrl, getInviteLink} from 'firstcut-retrieve-url';
import {getPlayer} from 'firstcut-utils';

const key = 'confirm_footage_uploaded';
const ConfirmFootageUpload = new Map({
  key,
  action_title: 'Confirm footage uploaded',
  completed_title: 'Footage confirmed uploaded',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
    // TODO: include this when confirmed historyIncludesEvent({record, event: 'shoot_wrap'});
    return !historyIncludesEvent({record, event: key}) && !historyIncludesEvent({record, event: 'footage_verified'});
  },
  generateActions: function(event_data) {
    const {record_id, initiator_player_id} = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    const collaborator = getPlayer(Models, initiator_player_id);
    let internal_emails = getEmailActions({
      recipients: [shoot.adminOwner],
      template: 'footage-confirmed-uploaded',
      getSubstitutionData: (recipient) => {
        let shoot_link = getInviteLink(recipient, getRecordUrl(shoot));
    		return {
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          initiator_name: collaborator.displayName,
          shoot_link
        }
    	}
    });

    let confirmation_emails = getEmailActions({
      recipients: [collaborator],
      template: 'thank-you-for-uploading-footage',
      getSubstitutionData: (recipient) => {
        let shoot_link = getInviteLink(recipient, getRecordUrl(shoot));
        return {
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
        }
    	}
    });

    let email_actions = [...confirmation_emails, ...internal_emails];
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `Footage for ${shoot.displayName} has been confirmed as uploaded by ${collaborator.displayName}.`
      }
    },
    ...email_actions
    ]
  }
});

export default ConfirmFootageUpload;
