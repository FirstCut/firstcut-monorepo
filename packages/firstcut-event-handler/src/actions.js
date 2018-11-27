
import Slack from 'firstcut-slack';
import FirstCutSchema from 'firstcut-schema';
import { _ } from 'lodash';

// defines what action types are supported -- soon to include calendar events, emails, etc
export const ACTIONS = {
  SLACK_NOTIFY: 'slack_notify',
};

const typeRegex = _.values(ACTIONS).reduce((res, a, i) => {
  if (i === 0) {
    return a;
  }
  return `${res}|${a}`;
}, '');

export const SlackActionSchema = new FirstCutSchema({
  required: ['type'],
  properties: {
    content: {
      required: ['text'],
      properties: {
        channel: { type: 'string' },
        text: { type: 'string' },
        as_user: { type: 'string' },
        link_names: { type: 'string' },
        mrkdwn: { type: 'boolean' },
      },
    },
    channel: { type: 'string' },
    type: { type: 'string', pattern: typeRegex },
  },
});

export const ActionSchemas = {
  [ACTIONS.SLACK_NOTIFY]: SlackActionSchema,
};

const slackClient = new Slack({
  defaultChannel: 'projectrequests',
  accessToken: process.env.SLACK_ACCESS_TOKEN,
});

const slackTemplateDefaults = {
  username: 'firstcut',
  link_names: true,
};

export function sendSlackNotification(action) {
  return new Promise((resolve, reject) => {
    let { content } = action;
    const { channel } = action;
    content = {
      ...slackTemplateDefaults,
      ...content,
    };
    slackClient.postMessage(content, channel).then(res => resolve({})).catch(reject);
  });
}
