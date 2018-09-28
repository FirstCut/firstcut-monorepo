
import { Map } from 'immutable';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions } from './shared/action.utils';
import { humanReadableDate } from 'firstcut-utils';
import Models from 'firstcut-models';
import { getInviteLink, getRecordUrl } from 'firstcut-retrieve-url';

const UpcomingShootReminder = new Map({
  key: 'upcoming_shoot_reminder',
  action_title: 'Send Upcoming Shoot Reminder',
  completed_title: 'Upcoming Shoot Reminder Sent',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(eventData) {
    const { record_id } = eventData;
    const shoot = Models.Shoot.fromId(record_id);
    const scheduledDate = humanReadableDate({ date: shoot.date, timezone: shoot.timezone, format: 'clean' });
    const footageFolder = shoot.footageFolder || shoot.generateFootageFolderName();
    const internalEmails = getEmailActions({
      recipients: [shoot.adminOwner, shoot.interviewer, shoot.videographer],
      template: 'upcoming-shoot-reminder',
      getSubstitutionData: recipient => ({
        project_manager_name: shoot.adminOwnerDisplayName,
        name: recipient.firstName,
        shoot_name: shoot.displayName,
        scheduled_date: scheduledDate,
        footage_folder: footageFolder,
      }),
    });

    const videographerEmails = getEmailActions({
      recipients: [shoot.videographer],
      template: 'videographer-upcoming-shoot-reminder',
      getSubstitutionData: (recipient) => {
        const shootLink = getInviteLink(shoot.videographer, getRecordUrl(shoot));
        return {
          project_manager_name: shoot.adminOwnerDisplayName,
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          scheduled_date: scheduledDate,
          reply_to: shoot.adminOwnerEmail,
          footage_folder: footageFolder,
          shoot_link: shootLink,
        };
      },
    });

    const clientEmails = getEmailActions({
      recipients: [shoot.clientOwner],
      cc: [shoot.adminOwner],
      template: 'ttc-shoot-reminder',
      getSubstitutionData: (recipient) => {
        const shootLink = getInviteLink(shoot.clientOwner, getRecordUrl(shoot));
        const shootDate = humanReadableDate({ date: shoot.date, format: 'formal_day' });
        return {
          name: recipient.firstName,
          project_name: shoot.projectDisplayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_date: shootDate,
          shoot_link: shootLink,
        };
      },
    });


    const emailActions = [...internalEmails, ...clientEmails, ...videographerEmails];
    return [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `Reminder about an upcoming shoot: ${shoot.displayName} is scheduled for ${scheduledDate} ${shoot.adminOwnerSlackHandle}`,
        },
      }];
  },
});

export default UpcomingShootReminder;
