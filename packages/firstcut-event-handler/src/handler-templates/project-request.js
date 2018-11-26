
import { Map } from 'immutable';
import { ACTIONS } from '../actions.js';

const ProjectRequest = new Map({
  key: 'project_request',
  fulfillsPrerequisites(eventData) {
    return true;
  },
  generateActions(eventData) {
    const {
      firstName, lastName, email, company, about, projectId, location, budget,
    } = eventData;
    return [
      {
        type: ACTIONS.slack_notify,
        channel: 'projectrequests',
        content: {
          text: `*Name*: ${firstName} ${lastName}\n *Company*: ${company} \n *Project id*: ${projectId}\n *Email*: ${email}\n *About*: ${about}\n, *Budget* : ${budget}\n, *Location*: ${location}\n`,
          mrkdwn: true,
        },
      }];
  },
});

export default ProjectRequest;
