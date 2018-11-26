
import Slack from 'firstcut-slack';

export const ACTIONS = {
  SLACK_NOTIFY: 'slack_notify',
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
