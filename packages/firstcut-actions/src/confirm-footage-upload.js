
import { Map } from 'immutable';
import Models from 'firstcut-models';
import moment from 'moment';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions, recordHistoryIncludesEvent } from 'firstcut-action-utils';
import { getRecordUrl, getInviteLink } from 'firstcut-retrieve-url';
import { getPlayer } from 'firstcut-players';

const key = 'confirm_footage_uploaded';
const ConfirmFootageUpload = new Map({
  key,
  action_title: 'Confirm footage uploaded',
  completed_title: 'Footage confirmed uploaded',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    // TODO: include this when confirmed recordHistoryIncludesEvent({record, event: 'shoot_wrap'});
    const dayOfShoot = moment(record.date);
    const isAfterDayOfShoot = moment().isAfter(dayOfShoot);
    return (
      isAfterDayOfShoot
      && !recordHistoryIncludesEvent({ record, event: key })
      && !recordHistoryIncludesEvent({ record, event: 'footage_verified' })
    );
  },
  generateActions(event_data) {
    const { record_id, initiator_player_id } = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    const collaborator = getPlayer(initiator_player_id);
    const internal_emails = getEmailActions({
      recipients: [shoot.adminOwner],
      template: 'footage-confirmed-uploaded',
      getSubstitutionData: (recipient) => {
        const shoot_link = getRecordUrl(shoot);
    		return {
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          initiator_name: collaborator.displayName,
          shoot_link,
        };
    	},
    });

    const confirmation_emails = getEmailActions({
      recipients: [collaborator],
      template: 'thank-you-for-uploading-footage',
      getSubstitutionData: (recipient) => {
        const shoot_link = getInviteLink(recipient, getRecordUrl(shoot));
        return {
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
        };
    	},
    });

    const emailActions = [...confirmation_emails, ...internal_emails];
    return [{
      type: ACTIONS.slack_notify,
      content: {
        text: `Footage for ${shoot.displayName} has been confirmed as uploaded by ${collaborator.displayName}.`,
      },
    },
    ...emailActions,
    ];
  },
});

export default ConfirmFootageUpload;