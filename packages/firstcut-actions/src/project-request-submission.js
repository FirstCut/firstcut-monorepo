
import { Map } from 'immutable';
import { RecordEvents } from 'firstcut-action-utils';
import { ACTIONS } from 'firstcut-pipeline-consts';

const ProjectRequestSubmission = new Map({
  key: 'project_request_submission',
  action_title: 'Submit project request',
  completed_title: 'Project request submitted',
  schema: RecordEvents,
  fulfillsPrerequisites({ record, initiator }) {
    return true;
  },
  generateActions(Models, eventData) {
    const {
      first, last, email, company, about, projectTitle, location, budget, projectId,
    } = eventData;
    return [
      {
        type: ACTIONS.slack_notify,
        channel: 'projectrequests',
        content: {
          text: `REQUEST FOR PROJECT ${projectTitle}\n *Project Id*: ${projectId}\n\n *Name*: ${first} ${last}\n *Company*: ${company} \n *Email*: ${email}\n *Shoot location*: ${location}\n *Budget range*: ${budget}\n*More info*: ${about}`,
          mrkdwn: true,
        },
      }, {
        type: ACTIONS.custom_function,
        execute() {
          const request = Models.LandingPageRequest.createNew(eventData);
          request.save();
        },
      }];
  },
});

export default ProjectRequestSubmission;
