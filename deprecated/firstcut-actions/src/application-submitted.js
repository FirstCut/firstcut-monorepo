import { Map } from 'immutable';
import { RecordEvents, getEmailActions } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';
import { getRecordUrl } from 'firstcut-retrieve-url';

const ApplicationSubmitted = new Map({
  key: 'application_submitted',
  action_title: 'Submit Application',
  completed_title: 'Application Submitted',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
  },
  generateActions(Models, eventData) {
    const { record_id } = eventData;
    const collaborator = Models.Collaborator.fromId(record_id);
    const link = getRecordUrl(collaborator);
    const emailActions = getEmailActions({
      recipients: [collaborator],
      template: 'thank-you-for-submitting-application',
      getSubstitutionData: recipient => ({
        name: recipient.firstName,
      }),
    });

    return [
      ...emailActions,
      {
        type: ACTIONS.slack_notify,
        content: {
          text: `An application to be a collaborator was submitted -- ${link}`,
        },
      }];
  },
});

export default ApplicationSubmitted;
