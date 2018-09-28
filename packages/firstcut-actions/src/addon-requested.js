
import { Map } from 'immutable';
import Models from 'firstcut-models';
import { RecordEvents } from './shared/action.schemas';
import { getAddOnPrice, ACTIONS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';
import { getPlayer } from 'firstcut-players';
import { getEmailActions } from './shared/action.utils';

const AddOnRequested = new Map({
  key: 'add_on_requested',
  action_title: 'Request add on',
  completed_title: 'Add on requested',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(eventData) {
    const { record_id, initiator_player_id, addOn } = eventData;
    const cut = Models.Cut.fromId(record_id);
    const link = getRecordUrl(cut);
    const player = getPlayer(initiator_player_id);

    const internalEmails = getEmailActions({
      recipients: [cut.adminOwner],
      template: 'add-on-requested',
      getSubstitutionData: recipient => ({
        cut_name: cut.displayName,
        name: recipient.firstName,
        player_name: player.displayName,
        player_email: player.email,
        price: getAddOnPrice(addOn),
        add_on: addOn,
        link,
      }),
    });

    const clientEmails = getEmailActions({
      recipients: [player],
      cc: [cut.adminOwner],
      template: 'client-confirm-addon-requested',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        add_on: addOn,
        reply_to: cut.adminOwnerEmail,
      }),
    });

    const emailActions = [...clientEmails, ...internalEmails];
    return [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `ADDON REQUESTED: ${cut.adminOwnerSlackHandle} : ${player.displayName} from ${player.companyDisplayName} has requested ${addOn} for their cut (${link}). Please email them to confirm the request.`,
        },
      }];
  },
});

export default AddOnRequested;
