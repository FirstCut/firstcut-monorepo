import { postMessage } from './slack';
import { SlackContentSchema } from './slack.schemas';

const Slack = {
  postMessage,
}

export { Slack, SlackContentSchema };
