import {Map} from 'immutable';
import {Models} from 'firstcut-models';
import {RecordEvents} from '../shared/pipeline.schemas.js';
import {ACTIONS} from '../shared/pipeline.enum.js';
import {getEmailActions, setInvoicesToDue, historyIncludesEvent} from '../shared/pipeline.utils.js';
import {getRecordUrl} from 'firstcut-retrieve-url';

const key = 'project_wrap';
const ProjectWrap = new Map({
  key,
  action_title: 'Wrap project',
  completed_title: 'Project wrapped',
  schema: RecordEvents,
  fulfillsPrerequisites: function({record, initiator}) {
    return !historyIncludesEvent({record, event:key});
  },
  generateActions: function(event_data) {
    const {record_id} = event_data;
    const project = Models.getRecordFromId('Project', record_id);
    const link = getRecordUrl(project);
    let email_actions = getEmailActions({
      recipients: [project.adminOwner],
      template: 'project-wrap',
      getSubstitutionData: (recipient) => {
        return {project_name: project.displayName, project_manager_name: project.adminOwnerDisplayName, link}
      }
    });

    return [
      ...email_actions, {
        type: ACTIONS.custom_function,
        title: 'set this projects invoices to due',
        execute: () => {
          setInvoicesToDue(project);
        }
      }, {
        type: ACTIONS.slack_notify,
        content: {
          text: `${project.displayName} wrapped! ${link}`
        }
      }
    ]
  }
});

export default ProjectWrap;
