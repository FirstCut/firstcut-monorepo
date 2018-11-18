
import { Map } from 'immutable';
import { getEmailActions, RecordEvents } from 'firstcut-action-utils';
import { getRecordUrl } from 'firstcut-retrieve-url';
import moment from 'moment';

const key = 'notify_client_of_messages';

const NotifyClientOfNewMessages = new Map({
  key,
  action_title: 'Notify Client Of Messages',
  completed_title: 'Client notified that they have messages',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return true;
  },
  generateActions(Models, eventData) {
    const {
      record_id,
      initiator_player_id,
      clientEmailContent,
    } = eventData;
    const project = Models.Project.fromId(record_id);
    const initiator = Models.getPlayer(initiator_player_id);
    const emailActions = getEmailActions({
      recipients: [project.clientOwner],
      cc: [project.adminOwner],
      template: 'notify-client-of-messages',
      getSubstitutionData: (recipient) => {
        const projectLink = getRecordUrl(project);
        return {
          name: recipient.firstName,
          project_name: project.displayName,
          admin_owner_name: project.adminOwnerDisplayName,
          reply_to: project.adminOwnerEmail,
          project_link: projectLink,
        };
      },
    });

    return [
      ...emailActions,
    ];
  },
});

export default NotifyClientOfNewMessages;
