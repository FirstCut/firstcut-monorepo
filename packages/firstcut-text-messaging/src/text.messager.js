import twilio from 'twilio';
import SimpleSchema from 'simpl-schema';
import { removePunctuation } from 'firstcut-utils';

export const SUPPORTED_COUNTRIES = ['United States', 'United Kingdom'];

function getFromNumber(country) {
  if (Meteor.settings.public.environment == 'development') {
    return '+15005550006';
  } else if (country == 'United Kingdom') {
    return '+441133203346';
  }{
    return '+17162190340';
  }
}

export function sendTextMessage({to, body, country}) {
  new SimpleSchema({
    to: {
     type: String,
     regEx: SimpleSchema.RegEx.phone
    },
    body: String,
    country: {
      type: String,
      allowedValues: SUPPORTED_COUNTRIES,
      optional: true
    }
  }).validate({to, body, country});

  const sid = Meteor.settings.twilio.sid;
  const authToken = Meteor.settings.twilio.authToken;
  const client = twilio(sid, authToken);
  const from = getFromNumber(country);
  to = removePunctuation(to);

  return client.messages.create({body, from, to});
}
