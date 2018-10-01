import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getInviteLink } from 'firstcut-retrieve-url';
import { getPlayer } from 'firstcut-players';
import { getEmailActions } from 'firstcut-action-utils';

const SendInviteLink = new Map({
  key: 'send_invite_link',
  action_title: 'Send invite link',
  completed_title: 'Invite link sent',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return true;
  },
  generateActions(eventData) {
    const { record_id, initiator_player_id } = eventData;
    const player = getPlayer(record_id);
    const initiator = getPlayer(initiator_player_id);
    const inviteLink = getInviteLink(player);

    const invites = getEmailActions({
      recipients: [player],
      cc: [initiator],
      template: 'tc-send-invite-link',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        invite_link: inviteLink,
      }),
    });

    return [
      ...invites,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `${player.displayName} has been invited to our platform.`,
        },
      }];
  },
});

export default SendInviteLink;
