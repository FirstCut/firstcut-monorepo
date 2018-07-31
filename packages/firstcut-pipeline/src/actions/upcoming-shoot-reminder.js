
import {Map} from 'immutable';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions} from '../shared/pipeline.utils.js';
import {humanReadableDate} from 'firstcut-utils';
import {Models} from 'firstcut-models';
import {getInviteLink, getRecordUrl} from 'firstcut-retrieve-url';

const UpcomingShootReminder = new Map({
  key: 'upcoming_shoot_reminder',
  action_title: "Send Upcoming Shoot Reminder",
  completed_title: "Upcoming Shoot Reminder Sent",
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const shoot = Models.Shoot.fromId(record_id);
    const scheduled_date = humanReadableDate({date: shoot.date, timezone: shoot.timezone, format:'clean'});
    const footage_folder = shoot.footageFolder || shoot.generateFootageFolderName();
    let internal_emails = getEmailActions({
      recipients: [shoot.adminOwner, shoot.interviewer, shoot.videographer],
    	template: 'upcoming-shoot-reminder',
    	getSubstitutionData: (recipient) => {
    		return {
          project_manager_name: shoot.adminOwnerDisplayName,
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          scheduled_date: scheduled_date,
          footage_folder
        }
    	}
    });

    let videographer_emails = getEmailActions({
      recipients: [shoot.videographer],
    	template: 'videographer-upcoming-shoot-reminder',
    	getSubstitutionData: (recipient) => {
        let shoot_link = getInviteLink(shoot.videographer, getRecordUrl(shoot));
    		return {
          project_manager_name: shoot.adminOwnerDisplayName,
          name: recipient.firstName,
          shoot_name: shoot.displayName,
          scheduled_date: scheduled_date,
          reply_to: shoot.adminOwnerEmail,
          footage_folder,
          shoot_link
        }
    	}
    });

    let client_emails = getEmailActions({
    	recipients: [shoot.adminOwner],
    	template: 'ttc-shoot-reminder',
    	getSubstitutionData: (recipient) => {
        let shoot_link = getInviteLink(shoot.clientOwner, getRecordUrl(shoot));
        const shoot_date = humanReadableDate({date: shoot.date, format:'formal_day'});
    		return {
          name: shoot.clientOwner.firstName,
          project_name: shoot.projectDisplayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_date,
          shoot_link
        }
    	}
    });


    let email_actions = [...internal_emails, ...client_emails, ...videographer_emails];
    return [
      ...email_actions,
      {
      type: ACTIONS.slack_notify,
      content: {
        text: `Reminder about an upcoming shoot: ${shoot.displayName} is scheduled for ${scheduled_date}`
      }
    }]
  }
});

export default UpcomingShootReminder;
