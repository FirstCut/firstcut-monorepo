
import { Map } from 'immutable';
import { ACTIONS } from '../actions.js';

const ProjectRequest = new Map({
  key: 'project_request',
  fulfillsPrerequisites(eventData) {
    return true;
  },
  generateActions(eventData) {
    const {
      first, last, email, company, about, projectId, location, budget,
    } = eventData;
    return [
      {
        type: ACTIONS.slack_notify,
        channel: 'projectrequests',
        content: {
          text: `*Name*: ${first} ${last}\n *Company*: ${company} \n *Project id*: ${projectId}\n *Email*: ${email}\n *About*: ${about}, *Budget* : ${budget}, *Location*: ${location}`,
          mrkdwn: true,
        },
      }];
  },
});

export default ProjectRequest;
