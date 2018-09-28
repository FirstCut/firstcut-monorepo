
import { Map } from 'immutable';
import Models from 'firstcut-models';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions } from './shared/action.utils';
import { getRecordUrl, getInviteLink } from 'firstcut-retrieve-url';

const ShootWrap = new Map({
  key: 'shoot_wrap',
  action_title: 'Shoot wrap',
  completed_title: 'Shoot wrapped',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(eventData) {
    const { record_id } = eventData;
    const shoot = Models.Shoot.fromId(record_id);
    const behindTheScenesShots = shoot.getBehindTheScenesShots();
    const behindTheScenesURLs = behindTheScenesShots.map(s => shoot.screenshotURL(s.filename));
    const emailActions = getEmailActions({
      recipients: [shoot.clientOwner],
      cc: [shoot.adminOwner],
      template: 'ttc-shoot-wrap',
      getSubstitutionData: (recipient) => {
        const shootLink = getInviteLink(shoot.clientOwner, getRecordUrl(shoot));
        return {
          name: shoot.clientOwner.firstName,
          shoot_display_name: shoot.displayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_link: shootLink,
        };
      },
    });

    return [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `Shoot Wrap notification for ${shoot.displayName} ${shoot.adminOwnerSlackHandle}. Contact the videographer to assist them with footage upload <@U80MSNACR>`,
        },
      }];
  },
});

export default ShootWrap;
