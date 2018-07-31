import {s3} from 'firstcut-aws';
import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions, historyIncludesEvent} from '../shared/pipeline.utils.js';
import {getRecordUrl, getInviteLink} from 'firstcut-retrieve-url';

const key = 'preproduction_kickoff';

const PreproductionKickoff = new Map({
  key,
  action_title: 'Shoot ready',
  completed_title: 'Shoot ready',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
    return !historyIncludesEvent({record, event: key});
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    let shoot = Models.getRecordFromId('Shoot', record_id);
    const folder = shoot.generateFootageFolderName();
    let internal_emails = getEmailActions({
      recipients: [shoot.adminOwner],
      template: 'ttp-preproduction-kickoff',
      getSubstitutionData: (recipient) => {
        let shoot_link = getInviteLink(recipient, getRecordUrl(shoot));
        return {
          name: recipient.firstName,
          project_name: shoot.projectDisplayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_link
        }
      }
    });

    let client_emails = getEmailActions({
      recipients: [shoot.adminOwner],
      template: 'ttc-pre-production-kickoff-text',
      getSubstitutionData: (recipient) => {
        let shoot_link = getInviteLink(recipient, getRecordUrl(shoot));
        return {
          name: shoot.clientOwner.firstName,
          project_name: shoot.projectDisplayName,
          admin_owner_name: shoot.adminOwnerDisplayName,
          reply_to: shoot.adminOwnerEmail,
          shoot_link
        }
      }
    });

    let email_actions = [...internal_emails, ...client_emails];
    const bucket = Meteor.settings.public.source_footage_bucket;
    return [
      ...email_actions,
    {
      type: ACTIONS.slack_notify,
      content: {
        text: `${shoot.projectDisplayName} has kicked off preproduction! --- ${getRecordUrl(shoot)}`
      }
    }, {
      type: ACTIONS.custom_function,
      title: `create a folder in the s3 bucket ${bucket} for the footage named ${folder}`,
      execute: () => {
        return new Promise((resolve, reject) => {
          s3.putObject({
            StorageClass: 'STANDARD',
            Bucket: bucket,
            Key: folder,
          }, Meteor.bindEnvironment((err) => {
            if (!err) {
              shoot = shoot.set('footageFolderName', folder);
              shoot.save();
              resolve();
            } else {
              reject(err);
            }
          }))
        });
      }
    }]
  }
});

export default PreproductionKickoff;
