
import { SimpleSchemaWrapper } from '/imports/api/schema';
import { Map } from 'immutable';
import Models from 'firstcut-models';
import { RecordEvents } from './shared/action.schemas';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions, recordHistoryIncludesEvent } from './shared/action.utils';
import { getRecordUrl, getInviteLink } from 'firstcut-retrieve-url';

const key = 'project_preproduction_kickoff';

const PreproductionKickoff = new Map({
  key,
  action_title: 'Preproduction Kickoff',
  completed_title: 'Preproduction kickedoff',
  customFieldsSchema: record => new SimpleSchemaWrapper({
    clientEmailContent: {
      type: String,
      rows: 10,
      customType: 'textarea',
      label: 'Client email custom body content',
      defaultValue: (`Hi ${(record.clientOwner) ? record.clientOwner.firstName : ''},\n\nI'm ${record.adminOwnerDisplayName}, your FirstCut Producer. I'm excited to be working with you on this project! Let's get started!\n\nPlease reply to this email with the following required items:\n\n- On-Site Contact’s Information: This is our contact person at each filming locations. They’ll meet our crew upon arrival and escort them to the room where we will be shooting.\n\n- On-Camera Names & Titles: Please provide the full names and titles of all persons who will speak on camera as well the company they work for.\n\n- Your Branding: Brand's logo vector file or High resolution image, brand guidelines and/or style sheet. If you use a licensed font please send us that too. This ensures the video(s) adhere to your brand identity.`),
    },
  }),
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return !recordHistoryIncludesEvent({ record, event: key }) && !recordHistoryIncludesEvent({ record, event: 'project_wrap' });
  },
  generateActions(eventData) {
    const {
      record_id,
      clientEmailContent,
    } = eventData;
    const project = Models.Project.fromId(record_id);
    const robert = Models.Collaborator.getRobertProfile();
    const jorge = Models.Collaborator.getJorgeProfile();
    const lines = (clientEmailContent) ? clientEmailContent.split(/\n/) : [];
    const emailActions = getEmailActions({
      recipients: [project.clientOwner],
      cc: [project.adminOwner, robert, jorge],
      template: 'preproduction-kickoff-to-client-ii',
      getSubstitutionData: (recipient) => {
        const projectLink = getInviteLink(recipient, getRecordUrl(project));
        return {
          name: (project.clientOwner) ? project.clientOwner.firstName : '',
          project_name: project.displayName,
          admin_owner_name: project.adminOwnerDisplayName,
          reply_to: project.adminOwnerEmail,
          project_link: projectLink,
          lines,
        };
      },
    });

    return [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `${project.displayName} ( ${getRecordUrl(project)} ) has kicked off preproduction. ${jorge.slackHandle} ${robert.slackHandle}`,
        },
      }];
  },
});

export default PreproductionKickoff;
