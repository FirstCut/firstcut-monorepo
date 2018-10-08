
import { WebClient } from '@slack/client';
import { SlackContentSchema } from './slack.schemas';


export function getChannel() {
  if (Meteor.isTest) {
    return 'devtesting';
  } if (Meteor.settings.public.environment == 'development') {
    return 'devtesting';
  } if (Meteor.settings.public.environment == 'production') {
    return 'postproduction';
  }
  throw Meteor.Error('unsatisfied-conditions', 'Could not retrieve channel. Is not test, development, or production environment.');
}

export function postMessage(content, channel) {
  const access_token = Meteor.settings.slack.api_token;
  const slack = new WebClient(access_token);
  const client_id = Meteor.settings.slack.client_id;
  const client_secret = Meteor.settings.slack.client_secret;
  if (!channel || Meteor.settings.public.environment == 'development') {
    channel = getChannel();
  }
  const result = { channel, ...content };
  SlackContentSchema.validate(result);
  return slack.chat.postMessage(result);
}
