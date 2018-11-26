
import { WebClient } from '@slack/client';

class Slack {
  constructor(conf) {
    if (!conf || !conf.accessToken) {
      throw new Error('slack package requires slack accessToken');
    }
    this.config = conf;
  }

  postMessage(content, channel = this.config.defaultChannel) {
    const { accessToken } = this.config;
    const slack = new WebClient(accessToken);
    console.log(slack);
    const result = { channel, ...content };
    console.log(result);
    return slack.chat.postMessage(result);
  }
}

export default Slack;
