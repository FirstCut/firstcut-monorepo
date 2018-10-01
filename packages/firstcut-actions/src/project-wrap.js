import { Map } from 'immutable';
import Models from 'firstcut-models';
import { SimpleSchemaWrapper } from 'firstcut-schema';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getEmailActions, setAllRecordInvoicesToDue, recordHistoryIncludesEvent } from 'firstcut-action-utils';
import { getRecordUrl } from 'firstcut-retrieve-url';

const key = 'project_wrap';
const ProjectWrap = new Map({
  key,
  action_title: 'Wrap project',
  completed_title: 'Project wrapped',
  schema: RecordEvents,
  customFieldsSchema: record => new SimpleSchemaWrapper({
    clientEmailContent: {
      type: String,
      rows: 10,
      customType: 'textarea',
      label: 'Client email custom body content',
      defaultValue: (`Congrats ${(record.clientOwner) ? record.clientOwner.firstName : ''}!\n\nYour project ${record.displayName} has been successfully completed!\nLinks to your files:\n 1) Download the MP4 version of your file here: {{{link to cut MP4}}}\n2) Download the footage with all the raw footage from your project.\n\nIf you have not paid already, our billing team will contact you shortly for final payment`),
    },
  }),
  fulfillsPrerequisites({ record, initiator }) {
    return !recordHistoryIncludesEvent({ record, event: key });
  },
  generateActions(eventData) {
    const { record_id, clientEmailContent } = eventData;
    const project = Models.getRecordFromId('Project', record_id);
    const link = getRecordUrl(project);

    const lines = (clientEmailContent !== 'undefined' && clientEmailContent) ? clientEmailContent.split(/\n/) : [''];
    const clientEmailActions = getEmailActions({
      recipients: [project.clientOwner],
      cc: [project.adminOwner],
      template: 'project-wrap-client',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
        project_name: project.displayName,
        admin_owner_name: project.adminOwnerDisplayName,
        reply_to: project.adminOwnerEmail,
        lines,
        link,
      }),
    });

    // const internalEmailActions = getEmailActions({
    //   recipients: [project.adminOwner],
    //   template: 'project-wrap',
    //   getSubstitutionData: recipient => ({
    //     project_name: project.displayName,
    //     project_manager_name: project.adminOwnerDisplayName,
    //     link,
    //   }),
    // });
    //
    const emailActions = [...clientEmailActions];
    return [
      ...emailActions, {
        type: ACTIONS.custom_function,
        title: 'set this projects invoices to due',
        execute: () => {
          setAllRecordInvoicesToDue(project);
        },
      }, {
        type: ACTIONS.slack_notify,
        content: {
          text: `${project.displayName} wrapped! ${link}`,
        },
      },
    ];
  },
});

export default ProjectWrap;
