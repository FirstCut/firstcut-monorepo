
import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions } from 'firstcut-action-utils';
import Models from 'firstcut-models';
import { getRecordUrl } from 'firstcut-retrieve-url';

const ProjectHandoff = new Map({
  key: 'project_handoff',
  action_title: 'Handoff project',
  completed_title: 'Project handoff',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(eventData) {
    const { record_id } = eventData;
    const project = Models.Project.fromId(record_id);
    const link = getRecordUrl(project);
    const kriza = Models.Collaborator.getKrizaProfile();
    const nicole = Models.Collaborator.getNicoleProfile();
    const robert = Models.Collaborator.getRobertProfile();
    const billing = Models.Collaborator.getBillingProfile();

    let emailActions = getEmailActions({
      recipients: [project.adminOwner],
      template: 'project-handoff',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        project_name: project.displayName,
        link,
      }),
    });

    emailActions = emailActions.concat(getEmailActions({
      recipients: [nicole, billing, robert],
      template: 'project-handoff-billing-notification',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        project_name: project.displayName,
        amount: project.invoiceAmount,
        reply_to: project.adminOwnerEmail,
        link,
      }),
    }));

    emailActions = emailActions.concat(getEmailActions({
      recipients: [project.clientOwner],
      cc: [project.adminOwner, robert],
      template: 'project-handoff-client',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        project_name: project.displayName,
        company_name: project.companyDisplayName,
        reply_to: project.adminOwner.email,
        link,
      }),
    }));

    const actions = [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        channel: 'activeprojects',
        content: {
          text: `Project handoff for project ${project.displayName}: ${project.adminOwnerSlackHandle} you have been assigned admin owner of this project. This is a reminder to send the intro email to the client soon.`,
        },
      },
      {
        type: ACTIONS.slack_notify,
        channel: 'activeprojects',
        content: {
          text: `${kriza.slackHandle} project ${project.displayName} and salesforce id ${project.salesforceId} ( ${project.getSalesforceLink()} ). Please upload the SOW to the project at ${link}`,
        },
      },
    ];
    if (project.clientOwner && !project.clientOwner.hasUserProfile) {
      actions.push(
        {
          type: ACTIONS.trigger_action,
          title: 'Send an invite links to the client owner',
          event_data: {
            event: 'send_invite_link',
            record_id: project.clientOwner._id,
            record_type: 'Client',
          },
        },
      );
    }
    return actions;
  },
});

export default ProjectHandoff;
