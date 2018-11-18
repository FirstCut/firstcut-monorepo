

import { SimpleSchemaWrapper } from 'firstcut-schema';
import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions, recordHistoryIncludesEvent } from 'firstcut-action-utils';
import { getRecordUrl, getInviteLink } from 'firstcut-retrieve-url';
import moment from 'moment';

const key = 'announce_new_feature';

const InviteToEditScript = new Map({
  key,
  action_title: 'Announce new feature',
  completed_title: 'Announced new feature',
  customFieldsSchema: record => new SimpleSchemaWrapper({
    cc: Array,
    'cc.$': String,
  }),
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return true;
  },
  generateActions(Models, eventData) {
    const {
      cc,
    } = eventData;
    const emailActions = getEmailActions({
      recipients: [{ email: 'lucy@firstcut.io' }],
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
