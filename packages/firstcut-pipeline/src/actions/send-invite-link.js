import {Map} from "immutable";
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getInviteLink} from 'firstcut-retrieve-url';
import {getPlayer} from 'firstcut-utils';

const SendInviteLink = new Map({
  key: 'send_invite_link',
  action_title: 'Send invite link',
  completed_title: 'Invite link sent',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
    return true;
  },
  generateActions: function(event_data) {
    const {record_id, initiator_player_id} = event_data;
    const player = getPlayer(Models, record_id);
    const invite_link = getInviteLink(player);
    // const email = (initiator_player_id) ? Models.Collaborator.fromId(initiator_player_id).email : 'the initiator email';
    return [{
        type: ACTIONS.send_email,
        to: [player.email],
        template: 'tc-send-invite-link',
        substitution_data: {
          name: player.firstName,
          invite_link
        }
      }, {
        type: ACTIONS.slack_notify,
        content: {
          text: `${player.displayName} has been invited to our platform.`
        }
      }]
  }
});

export default SendInviteLink;
