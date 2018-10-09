
import { SimpleSchemaWrapper } from 'firstcut-schema';
import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions, recordHistoryIncludesEvent } from 'firstcut-action-utils';
import { getRecordUrl, getInviteLink } from 'firstcut-retrieve-url';
import moment from 'moment';

const key = 'invite_to_edit_script';

const InviteToEditScript = new Map({
  key,
  action_title: 'Invite client to edit shoot script',
  completed_title: 'Invited client to edit shoot script',
  customFieldsSchema: record => new SimpleSchemaWrapper({
    clientEmailContent: {
      type: String,
      rows: 10,
      customType: 'textarea',
      label: 'Client email custom body content',
      defaultValue: (`Hi ${(record.clientOwner) ? record.clientOwner.firstName : ''},\nI'm looking forward to working on this script with you. Please follow the link below to view your shoot details and edit the script.`),
    },
  }),
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    if (!record.date || !record.timezone) {
      return true;
    }
    const shootDate = moment.tz(record.date, record.timezone);
    return (
      moment().isBefore(shootDate)
      && !recordHistoryIncludesEvent({ record, event: 'upcoming_shoot_reminder' })
      && !recordHistoryIncludesEvent({ record, event: 'shoot_wrap' })
    );
  },
  generateActions(Models, eventData) {
    const {
      record_id,
      initiator_player_id,
      clientEmailContent,
    } = eventData;
    const shoot = Models.Shoot.fromId(record_id);
    const initiator = Models.getPlayer(initiator_player_id);
    const lines = (clientEmailContent) ? clientEmailContent.split(/\n/) : [];
    const emailActions = getEmailActions({
      recipients: [shoot.clientOwner],
      cc: [shoot.adminOwner],
      template: 'invite-client-to-edit-script',
      getSubstitutionData: (recipient) => {
        const shootLink = getRecordUrl(shoot);
        return {
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_link: shootLink,
          lines,
        };
      },
    });

    return [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `${shoot.clientOwnerDisplayName} has been invited to collaborate on the shoot script by ${initiator.displayName}. ${shoot.adminOwnerSlackHandle}`,
        },
      }];
  },
});

export default InviteToEditScript;
